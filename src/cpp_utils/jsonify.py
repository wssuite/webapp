from pykson import Pykson, JsonObject


class Jsonify(JsonObject):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_json(self, data):
        return Pykson().from_json(data, self.__class__, accept_unknown=True)

    def to_json(self):
        return self._data
