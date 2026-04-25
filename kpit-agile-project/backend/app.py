from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import threading
import time
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from models import db
db.init_app(app)

CORS(app)

from models import *
from routes import *


def generate_report():

    from models import Project, UserStory, Task

    while True:

        time.sleep(30)

        with app.app_context():

            projects = Project.query.count()
            stories = UserStory.query.count()
            tasks = Task.query.count()

            print("\n===== PROJECT REPORT =====")
            print("Total Projects:", projects)
            print("Total Stories:", stories)
            print("Total Tasks:", tasks)
            print("===========================\n")


@app.route("/")
def home():
    return "Agile Project Manager Backend Running 🚀"


if __name__ == "__main__":

    worker = threading.Thread(target=generate_report)
    worker.daemon = True
    worker.start()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)