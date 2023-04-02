from pymongo.collection import Collection

from constants import (
    profile,
    start_date,
    end_date,
    version,
    mongo_all_operation,
    previous_versions,
    state,
    mongo_set_operation,
)
from src.models.solution import Solution
from src.dao.abstract_dao import AbstractDao


def get_solution_from_cursor(cursor):
    ret = []
    for element in cursor:
        solution = Solution().from_json(element)
        ret.append(solution.to_json())
    return ret


class SolutionDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.solution

    def insert_one(self, json):
        self.collection.insert_one(json)

    def fetch_all(self, profile_name):
        cursor = self.collection.find({profile: profile_name})
        return get_solution_from_cursor(cursor)

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def get_latest_versions(self, profile_name):
        all_solutions = self.fetch_all(profile_name)
        ret = []
        for solution in all_solutions:
            next_versions = self.get_next_versions(
                solution[start_date],
                solution[end_date],
                solution[profile],
                solution[version],
            )
            if len(next_versions) == 0:
                ret.append(solution)
        return ret

    def get_solution(self, start_date_, end_date_, profile_name_, version_):
        ret = self.collection.find_one(
            {
                start_date: start_date_,
                end_date: end_date_,
                profile: profile_name_,
                version: version_,
            }
        )
        return Solution().from_json(ret).db_json()

    def get_next_versions(
        self, start_date_, end_date_, profile_name_, version_
    ):
        cursor = self.collection.find(
            {
                previous_versions: {mongo_all_operation: [version_]},
                start_date: start_date_,
                end_date: end_date_,
                profile: profile_name_,
            }
        )
        return get_solution_from_cursor(cursor)

    def update_state(
        self, start_date_, end_date_, profile_name_, version_, new_state
    ):
        self.collection.find_one_and_update(
            {
                version: version_,
                start_date: start_date_,
                end_date: end_date_,
                profile: profile_name_,
            },
            {mongo_set_operation: {state: new_state}},
        )

    def remove(self, start_, end_, profile_name, v):
        self.collection.find_one_and_delete(
            {
                profile: profile_name,
                start_date: start_,
                end_date: end_,
                version: v,
            }
        )
