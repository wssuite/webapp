class Wrapper:
    array = []

    def __init__(self, arr):
        self.array = arr

    def get_by_index(self, index):
        try:
            return self.array[index]

        except IndexError:
            return ""


def sanitize_array(tokens):
    return [t for t in tokens if t != ""]


def skip_line(line):
    tokens = line.split(",")
    tokens = sanitize_array(tokens)
    return len(tokens) == 0 or ("#" in tokens[0])
