const API = "http://127.0.0.1:5000"

let selectedProject = null


// -----------------------------
// CREATE PROJECT
// -----------------------------
function createProject(){

const name = document.getElementById("name").value
const description = document.getElementById("description").value

fetch(API + "/projects",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
name:name,
description:description
})
})
.then(res=>res.json())
.then(data=>{
document.getElementById("name").value=""
document.getElementById("description").value=""
loadProjects()
})

}


// -----------------------------
// DELETE PROJECT
// -----------------------------
function deleteProject(projectId){

if(!confirm("Delete this project?")) return

fetch(API+"/projects/"+projectId,{
method:"DELETE"
})
.then(res=>res.json())
.then(data=>{

document.getElementById("projectDetails").innerHTML =
"<h2>Project Details</h2><p>Select a project to view stories</p>"

loadProjects()

})

}


// -----------------------------
// LOAD PROJECTS
// -----------------------------
function loadProjects(){

fetch(API + "/projects")
.then(res=>res.json())
.then(data=>{

const list = document.getElementById("projectList")
list.innerHTML=""

data.forEach(p=>{

const li=document.createElement("li")

li.innerHTML=`
<div class="projectCard">

<div class="projectInfo">
<b>${p.name}</b>
<p>${p.description || ""}</p>
</div>

<div class="projectButtons">
<button onclick="viewProject(${p.id})">Open</button>
<button onclick="deleteProject(${p.id})">Delete</button>
</div>

</div>
`

list.appendChild(li)

})

})

}


// -----------------------------
// VIEW PROJECT
// -----------------------------
function viewProject(projectId){

selectedProject = projectId

const section=document.getElementById("projectDetails")

section.innerHTML=`
<h2>Project Stories</h2>

<div class="storyInput">
<input id="storyTitle" placeholder="Story Title">
<button onclick="createStory()">Add Story</button>
</div>

<ul id="storyList"></ul>
`

loadStories()

}


// -----------------------------
// CREATE STORY
// -----------------------------
function createStory(){

const title=document.getElementById("storyTitle").value

fetch(API+"/stories",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
title:title,
project_id:selectedProject
})
})
.then(res=>res.json())
.then(data=>{

document.getElementById("storyTitle").value=""
loadStories()

})

}


// -----------------------------
// DELETE STORY
// -----------------------------
function deleteStory(storyId){

if(!confirm("Delete this story?")) return

fetch(API+"/stories/"+storyId,{
method:"DELETE"
})
.then(res=>res.json())
.then(data=>{
loadStories()
})

}


// -----------------------------
// LOAD STORIES
// -----------------------------
function loadStories(){

fetch(API+"/stories/"+selectedProject)
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("storyList")
list.innerHTML=""

data.forEach(s=>{

const li=document.createElement("li")
li.className="story"

li.innerHTML=`
<div class="storyHeader">
<b>${s.title}</b>
<button onclick="deleteStory(${s.id})">Delete</button>
</div>

<div class="taskInput">
<input id="task-${s.id}" placeholder="Task name">
<button onclick="createTask(${s.id})">Add Task</button>
</div>

<ul id="tasks-${s.id}"></ul>
`

list.appendChild(li)

loadTasks(s.id)

})

})

}


// -----------------------------
// CREATE TASK
// -----------------------------
function createTask(storyId){

const input = document.getElementById("task-"+storyId)
const title = input.value

fetch(API+"/tasks",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
title:title,
story_id:storyId
})
})
.then(res=>res.json())
.then(data=>{

input.value=""
loadTasks(storyId)

})

}


// -----------------------------
// DELETE TASK
// -----------------------------
function deleteTask(taskId,storyId){

if(!confirm("Delete this task?")) return

fetch(API+"/tasks/"+taskId,{
method:"DELETE"
})
.then(res=>res.json())
.then(data=>{
loadTasks(storyId)
})

}


// -----------------------------
// UPDATE TASK STATUS
// -----------------------------
function updateStatus(taskId,storyId,status){

fetch(API+"/tasks/"+taskId,{
method:"PUT",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({status:status})
})
.then(res=>res.json())
.then(data=>{
loadTasks(storyId)
})

}


// -----------------------------
// LOAD TASKS
// -----------------------------
function loadTasks(storyId){

fetch(API+"/tasks/"+storyId)
.then(res=>res.json())
.then(data=>{

const list=document.getElementById("tasks-"+storyId)

if(!list) return

list.innerHTML=""

data.forEach(t=>{

const li=document.createElement("li")

li.className="task"

if(t.status=="To Do") li.classList.add("todo")
if(t.status=="In Progress") li.classList.add("progress")
if(t.status=="Done") li.classList.add("done")

li.innerHTML=`
<span>${t.title}</span>

<select onchange="updateStatus(${t.id},${storyId},this.value)">
<option value="To Do" ${t.status=="To Do"?"selected":""}>To Do</option>
<option value="In Progress" ${t.status=="In Progress"?"selected":""}>In Progress</option>
<option value="Done" ${t.status=="Done"?"selected":""}>Done</option>
</select>

<button onclick="deleteTask(${t.id},${storyId})">Delete</button>
`

list.appendChild(li)

})

})

}


// -----------------------------
// INITIAL LOAD
// -----------------------------
loadProjects()