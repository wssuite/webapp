from .. import socketio


@socketio.on("joined")
def joined(json):
    socketio.emit("joined", json)
