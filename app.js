// ==========================
// STUDYFLOW FULL REAL APP
// ==========================

// ==========================
// STORAGE
// ==========================

let studyHours =
parseFloat(localStorage.getItem("studyHours")) || 0;

let completedTasks =
JSON.parse(localStorage.getItem("completedTasks")) || [];

let pendingTasks =
JSON.parse(localStorage.getItem("pendingTasks")) || [];

let focusSessions =
parseInt(localStorage.getItem("focusSessions")) || 0;

let currentSubject = "";

let timer = null;

let seconds = 0;

let running = false;

// SUBJECT DATA

let subjects =
JSON.parse(localStorage.getItem("subjects")) || {

python: 0,
aiml: 0,
dbms: 0

};

// ==========================
// PAGE SWITCHING
// ==========================

function showSection(id){

document.querySelectorAll(".page")
.forEach(page=>{

page.style.display = "none";

});

document.getElementById(id)
.style.display = "block";

}

// ==========================
// UPDATE DASHBOARD
// ==========================

function updateDashboard(){

// STUDY HOURS

document.getElementById("studyHours")
.innerText =
studyHours.toFixed(1);

// COMPLETED TASKS

document.getElementById("completedCount")
.innerText =
completedTasks.length;

// PRODUCTIVITY

let productivity = 0;

if(completedTasks.length > 0){

productivity += completedTasks.length * 10;

}

if(studyHours > 0){

productivity += Math.floor(studyHours * 15);

}

if(productivity > 100){

productivity = 100;

}

document.getElementById("productivity")
.innerText =
productivity + "%";

// SUBJECT HOURS

document.getElementById("pythonHours")
.innerText =
subjects.python.toFixed(1) + " hrs studied";

document.getElementById("aimlHours")
.innerText =
subjects.aiml.toFixed(1) + " hrs studied";

document.getElementById("dbmsHours")
.innerText =
subjects.dbms.toFixed(1) + " hrs studied";

// PROGRESS BARS

document.getElementById("pythonBar")
.style.width =
Math.min(subjects.python * 10,100) + "%";

document.getElementById("aimlBar")
.style.width =
Math.min(subjects.aiml * 10,100) + "%";

document.getElementById("dbmsBar")
.style.width =
Math.min(subjects.dbms * 10,100) + "%";

}

// ==========================
// TASKS
// ==========================

function renderTasks(){

const container =
document.getElementById("taskContainer");

container.innerHTML = "";

// PENDING

pendingTasks.forEach((task,index)=>{

const div =
document.createElement("div");

div.className = "task-card";

div.innerHTML = `

<h3>${task}</h3>

<button onclick="completeTask(${index})">
Complete
</button>

`;

container.appendChild(div);

});

// COMPLETED

completedTasks.forEach(task=>{

const div =
document.createElement("div");

div.className = "task-card completed";

div.innerHTML = `

<h3>✅ ${task}</h3>

<button disabled>
Completed
</button>

`;

container.appendChild(div);

});

}

// COMPLETE TASK

function completeTask(index){

const task =
pendingTasks[index];

completedTasks.push(task);

pendingTasks.splice(index,1);

localStorage.setItem(
"completedTasks",
JSON.stringify(completedTasks)
);

localStorage.setItem(
"pendingTasks",
JSON.stringify(pendingTasks)
);

renderTasks();

updateDashboard();

}

// ADD TASK

function addTomorrowTask(){

const task =
prompt("Enter tomorrow task");

if(!task) return;

pendingTasks.push(task);

localStorage.setItem(
"pendingTasks",
JSON.stringify(pendingTasks)
);

renderTasks();

}

// ==========================
// REAL TIMER
// ==========================

function startStudy(subject){

if(running){

alert("Study session already running");

return;

}

running = true;

currentSubject = subject;

focusSessions++;

localStorage.setItem(
"focusSessions",
focusSessions
);

timer = setInterval(()=>{

seconds++;

const hrs =
String(Math.floor(seconds/3600))
.padStart(2,"0");

const mins =
String(Math.floor((seconds%3600)/60))
.padStart(2,"0");

const secs =
String(seconds%60)
.padStart(2,"0");

document.getElementById("timer")
.innerText =
`${hrs}:${mins}:${secs}`;

},1000);

}

// STOP

function stopStudy(){

if(!running) return;

running = false;

clearInterval(timer);

const studied =
seconds / 3600;

studyHours += studied;

subjects[currentSubject] += studied;

// SAVE

localStorage.setItem(
"studyHours",
studyHours
);

localStorage.setItem(
"subjects",
JSON.stringify(subjects)
);

updateDashboard();

updateGraph();

alert(
`Study session saved:
${studied.toFixed(2)} hrs`
);

seconds = 0;

document.getElementById("timer")
.innerText =
"00:00:00";

}

async function sendMessage(){

const API_KEY = "YOUR_API_KEY";

const MODEL = "openai/gpt-3.5-turbo";

const input =
document.getElementById("userInput");

const text =
input.value.trim();

if(!text) return;

const area =
document.getElementById("chatArea");

// USER MESSAGE

const user =
document.createElement("div");

user.className = "user-msg";

user.innerText = text;

area.appendChild(user);

// BOT MESSAGE

const bot =
document.createElement("div");

bot.className = "bot-msg";

bot.innerText = "Thinking...";

area.appendChild(bot);

area.scrollTop =
area.scrollHeight;

input.value = "";

try{

const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },

    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: text
        }
      ]
    })
  }
);

const data = await response.json();

bot.innerText =
data.choices[0].message.content;

}catch(error){

bot.innerText =
"Connection Failed";

console.log(error);

}

}

// ENTER KEY

document
.getElementById("userInput")
.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

// ==========================
// SEARCH RESOURCES
// ==========================

const resources = [

{
title:"Python Full Course",
link:"https://www.youtube.com/results?search_query=python+course"
},

{
title:"DBMS Notes",
link:"https://www.geeksforgeeks.org/dbms/"
},

{
title:"AI & ML Tutorials",
link:"https://www.coursera.org/learn/machine-learning"
},

{
title:"DSA Problems",
link:"https://leetcode.com/problemset/"
},

{
title:"Java Course",
link:"https://www.w3schools.com/java/"
}

];

function searchResources(){

const query =
document.getElementById("resourceSearch")
.value
.toLowerCase();

const resultBox =
document.getElementById("searchResults");

if(!resultBox) return;

resultBox.innerHTML = "";

const filtered =
resources.filter(r=>
r.title.toLowerCase().includes(query)
);

if(filtered.length===0){

resultBox.innerHTML =
"<p>No resources found</p>";

return;

}

filtered.forEach(r=>{

resultBox.innerHTML += `

<div class="resource-card">

<h3>${r.title}</h3>

<a href="${r.link}" target="_blank">
Open Resource
</a>

</div>

`;

});

}

// ==========================
// REAL GRAPH
// ==========================

function updateGraph(){

const bars =
document.querySelectorAll(".bar");

const values = [

subjects.python * 10,

subjects.aiml * 10,

subjects.dbms * 10,

studyHours * 5,

completedTasks.length * 10,

focusSessions * 10

];

bars.forEach((bar,index)=>{

bar.style.height =
Math.min(values[index],300) + "px";

});

}

// ==========================
// INITIALIZE
// ==========================

updateDashboard();

renderTasks();

updateGraph();
