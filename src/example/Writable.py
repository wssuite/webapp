from pykson import Pykson, JsonObject


class Writable(JsonObject):
    def from_json(self, data: dict):
        return Pykson().from_json(data, self.__class__, accept_unknown=True)
