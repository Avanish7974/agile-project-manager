from app import app, db
from models import Project, UserStory, Task
from flask import request, jsonify



@app.route("/")
def home():
    return "Agile Project Manager Backend Running"


# -------------------------
# CREATE PROJECT
# -------------------------
@app.route('/projects', methods=['POST'])
def create_project():

    data = request.json

    project = Project(
        name=data['name'],
        description=data['description']
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({"message": "Project created"})


# -------------------------
# GET ALL PROJECTS
# -------------------------
@app.route('/projects', methods=['GET'])
def get_projects():

    projects = Project.query.all()

    result = []

    for p in projects:
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description
        })

    return jsonify(result)


# -------------------------
# CREATE STORY
# -------------------------
@app.route('/stories', methods=['POST'])
def create_story():

    data = request.json

    story = UserStory(
        title=data['title'],
        project_id=data['project_id']
    )

    db.session.add(story)
    db.session.commit()

    return jsonify({"message": "Story created"})


# -------------------------
# GET STORIES BY PROJECT
# -------------------------
@app.route('/stories/<int:project_id>', methods=['GET'])
def get_stories(project_id):

    stories = UserStory.query.filter_by(project_id=project_id).all()

    result = []

    for s in stories:
        result.append({
            "id": s.id,
            "title": s.title,
            "project_id": s.project_id
        })

    return jsonify(result)


# -------------------------
# CREATE TASK
# -------------------------
@app.route('/tasks', methods=['POST'])
def create_task():

    data = request.json

    task = Task(
        title=data['title'],
        status="To Do",
        story_id=data['story_id']
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"message": "Task created"})


# -------------------------
# GET TASKS BY STORY
# -------------------------
@app.route('/tasks/<int:story_id>', methods=['GET'])
def get_tasks(story_id):

    tasks = Task.query.filter_by(story_id=story_id).all()

    result = []

    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "story_id": t.story_id
        })

    return jsonify(result)

# -------------------------
# DELETE PROJECT
# -------------------------
@app.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):

    project = Project.query.get(project_id)

    if not project:
        return jsonify({"message": "Project not found"}),404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"message":"Project deleted"})


# -------------------------
# DELETE STORY
# -------------------------
@app.route('/stories/<int:story_id>', methods=['DELETE'])
def delete_story(story_id):

    story = UserStory.query.get(story_id)

    if not story:
        return jsonify({"message":"Story not found"}),404

    db.session.delete(story)
    db.session.commit()

    return jsonify({"message":"Story deleted"})


# -------------------------
# DELETE TASK
# -------------------------
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message":"Task not found"}),404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message":"Task deleted"})