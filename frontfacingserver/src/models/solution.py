import datetime

from constants import (
    start_date,
    end_date,
    profile,
    version,
    state,
    previous_versions,
    worker_host,
    timestamp,
)
from src.models.jsonify import Jsonify
from pykson import StringField, ListField
from src.models.db_document import DBDocument


class Solution(Jsonify, DBDocument):
    start_date = StringField(serialized_name=start_date)
    end_date = StringField(serialized_name=end_date)
    profile = StringField(serialized_name=profile)
    version = StringField(serialized_name=version)
    state = StringField(serialized_name=state)
    previous_versions = ListField(str, serialized_name=previous_versions)
    worker_host = StringField(serialized_name=worker_host, default_value="")
    timestamp = StringField(
        serialized_name=timestamp, default_value=f"{datetime.datetime.now()}"
    )

    def to_json(self):
        return {
            start_date: self.start_date,
            end_date: self.end_date,
            profile: self.profile,
            version: self.version,
            state: self.state,
            timestamp: self.timestamp,
        }

    def db_json(self) -> dict:
        json = self.to_json()
        json[previous_versions] = self.previous_versions
        json[worker_host] = self.worker_host
        return json
