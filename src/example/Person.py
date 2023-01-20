from pykson import JsonObject, StringField


class Person(JsonObject):
    name = StringField(serialized_name="name")
    eye_color = StringField(serialized_name="eye_color")

    def to_string(self):
        return "My name is {0} and my eye color is {1}".format(self.name, self.eye_color)

