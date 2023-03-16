def sanitize_array(tokens):
    return [t for t in tokens if t != '']


def skip_line(line):
    tokens = line.split(',')
    tokens = sanitize_array(tokens)
    return len(tokens) == 0 or ("#" in tokens[0])
