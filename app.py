from flask import Flask

from src.controllers import index
from src.controllers import schedule_controller
app = Flask(__name__)

app.register_blueprint(index.mod)
app.register_blueprint(schedule_controller.mod)
if __name__ == "__main__":
    app.run(host='0.0.0.0')
