from .. import socketio


@socketio.on("connect", namespace="/connect")
def handle_index(handle):
    print(handle)
    socketio.emit('after_connect',
                  {'data': 'Let us learn Web Socket in Flask'})
