from src.example.Person import Person
from unittest import TestCase
from pykson import Pykson


class TestPerson(TestCase):
    person_data = {
        "name": "random",
        "eye_color": "random"
    }
    correct_person = Person()
    correct_person.name = "random"
    correct_person.eye_color = "random"

    def test_person_creation(self):
        created_person = Pykson().from_json(
            self.person_data, Person, accept_unknown=True)
        self.assertTrue(created_person.name ==
                        self.correct_person.name)
        self.assertTrue(created_person.eye_color
                        == self.correct_person.eye_color)

    def test_person_to_string(self):
        self.assertTrue(self.correct_person.to_string()
                        == "My name is random and my eye color"
                           " is random")
