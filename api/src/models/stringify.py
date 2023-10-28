class Stringify:
    def to_string(self):
        pass


def extract_string_from_simple_object_array(array):
    ret_string = ""
    for element in array:
        ret_string += f",{element}"
    return ret_string


def extract_string_from_complex_object_array(array):
    ret_string = ""
    for element in array:
        ret_string += element.to_string()
    return ret_string
