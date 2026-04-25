from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Project Table
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(200))


# User Story Table
class UserStory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'))


# Task Table
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    status = db.Column(db.String(50))
    story_id = db.Column(db.Integer, db.ForeignKey('user_story.id'))