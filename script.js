/* =========================
   USER SYSTEM
========================= */

let currentUser = null

function signup(){
  let u = username.value
  let p = password.value

  if(!u || !p) return alert("Fill both")

  localStorage.setItem("user_"+u, JSON.stringify({password:p, streak:0}))
  alert("Account created! Login now.")
}

function login(){
  let u = username.value
  let p = password.value

  let data = JSON.parse(localStorage.getItem("user_"+u))

  if(!data || data.password !== p){
    alert("Wrong login")
    return
  }

  currentUser = u
  authBox.style.display="none"
  app.style.display="block"
  welcome.innerText = "Welcome, "+u

  loadUserData()
}

function logout(){
  location.reload()
}



/* =========================
   SAVE / LOAD USER DATA
========================= */

function saveUser(data){
  let base = JSON.parse(localStorage.getItem("user_"+currentUser))
  localStorage.setItem("user_"+currentUser, JSON.stringify({...base, ...data}))
}

function loadUserData(){
  let data = JSON.parse(localStorage.getItem("user_"+currentUser))
  streak = data.streak || 0
  document.getElementById("streak").innerText = streak
}



/* =========================
   TIMER
========================= */

let seconds=0
let interval=null

function startTimer(){
  if(interval) return
  interval=setInterval(()=>{
    seconds++
    let m=String(Math.floor(seconds/60)).padStart(2,"0")
    let s=String(seconds%60).padStart(2,"0")
    timer.innerText=`${m}:${s}`
  },1000)
}

function stopTimer(){
  clearInterval(interval)
  interval=null
}

function resetTimer(){
  stopTimer()
  seconds=0
  timer.innerText="00:00"
}



/* =========================
   STREAK
========================= */

let streak=0

function completeWorkout(){
  streak++
  document.getElementById("streak").innerText=streak
  saveUser({streak})
}



/* =========================
   VOLUME
========================= */

function calcVolume(){
  let v=weight.value*reps.value
  volumeResult.innerText="Volume: "+v+" kg"
}



/* =========================
   INTENSITY
========================= */

intensity.oninput=()=> intensityValue.innerText=intensity.value



/* =========================
   MUSIC
========================= */

musicFile.onchange=(e)=>{
  player.src=URL.createObjectURL(e.target.files[0])
}



/* =========================
   AI COACH (SMART LOGIC)
========================= */

function askCoach(){

  let text = coachInput.value.toLowerCase()
  let level = intensity.value

  let reply=""

  if(text.includes("tired") || text.includes("sad"))
    reply="Low energy day. Reduce volume 20%. Focus on form. Discipline beats motivation."

  else if(level >= 8)
    reply="High intensity detected. Rest longer between sets. CNS recovery matters."

  else if(streak >= 7)
    reply="7+ day streak… warrior mode activated. Proud of you. Don’t break momentum."

  else
    reply="Train steady. Progressive overload. Eat well. Sleep deep. You’re building something real."

  coachReply.innerText = reply
}
/* LOADER HIDE */
window.onload = () => {
  setTimeout(()=>{
    document.getElementById("loader").style.display="none"
  },1200)
}


/* SOUND EFFECTS */
function playClick(){
  document.getElementById("clickSound").play()
}

function playSuccess(){
  document.getElementById("successSound").play()
}


/* SAVE WEIGHTS PER USER */
function saveLift(exercise, weight){
  const user = localStorage.getItem("currentUser")
  let data = JSON.parse(localStorage.getItem(user+"_lifts")) || {}

  data[exercise] = weight

  localStorage.setItem(user+"_lifts", JSON.stringify(data))
  playSuccess()
}


/* LOAD WEIGHTS */
function loadLifts(){
  const user = localStorage.getItem("currentUser")
  return JSON.parse(localStorage.getItem(user+"_lifts")) || {}
}


/* SMARTER AI COACH */
function aiCoach(question){
  question = question.toLowerCase()

  if(question.includes("tired") || question.includes("burnout"))
    return "Rest day. Recovery builds strength. Even warriors sleep."

  if(question.includes("fat") || question.includes("cut"))
    return "Calorie deficit + protein + steps. Consistency beats motivation."

  if(question.includes("muscle") || question.includes("bulk"))
    return "Progressive overload. Eat more. Sleep 8h. Lift heavy."

  if(question.includes("sad") || question.includes("depressed"))
    return "Training isn't punishment. It's therapy. Start small. I'm with you."

  return "Train smart. Log your numbers. Small wins compound daily."
}


/* PERSONAL STREAK SYSTEM */
function updateStreak(){
  const today = new Date().toDateString()
  const last = localStorage.getItem("lastWorkout")
  let streak = parseInt(localStorage.getItem("streak")||0)

  if(last !== today){
    streak++
    localStorage.setItem("streak", streak)
    localStorage.setItem("lastWorkout", today)
  }

  document.getElementById("streakCount").innerText = streak
}


/* PWA INSTALL */
let deferredPrompt;

window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  deferredPrompt = e;
})
/* ========================
   REAL AI COACH (ChatGPT)
======================== */

const OPENAI_KEY = "PASTE_YOUR_API_KEY_HERE";

async function askRealCoach(){

  const msg = document.getElementById("coachInput").value;
  const replyBox = document.getElementById("coachReply");

  replyBox.innerText = "Thinking...";

  try{
    const res = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + OPENAI_KEY
      },
      body:JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"system",content:"You are a supportive fitness coach. Give short direct gym advice."},
          {role:"user",content:msg}
        ]
      })
    });

    const data = await res.json();

    replyBox.innerText = data.choices[0].message.content;

  }catch(e){
    replyBox.innerText = "Offline. Using local coach instead.";
    replyBox.innerText = aiCoach(msg); // fallback
  }
}
/* OFFLINE MODE */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
/* WORKOUT PLAN GENERATOR */

function generatePlan(){

  const goal = document.getElementById("goal").value;
  let plan="";

  if(goal==="strength"){
    plan=`
Push:
Bench 5x5
OHP 4x6
Dips 3x8

Pull:
Pullups 5x5
Rows 4x6
Curls 3x10

Legs:
Squat 5x5
RDL 4x6
Calf raises
`;
  }

  if(goal==="muscle"){
    plan=`
Chest + Triceps
Back + Biceps
Legs
Shoulders
Arms
Rest
`;
  }

  if(goal==="fatloss"){
    plan=`
Full body circuits
Pushups
Squats
Pullups
Skipping
HIIT 20min
Daily walk 8k steps
`;
  }
/* =========================
   DAILY WORKOUT REMINDER
========================= */

let reminderInterval = null;

function setReminder(){

  const time = document.getElementById("reminderTime").value;

  if(!time) return alert("Pick a time first ❤️");

  localStorage.setItem("reminderTime", time);

  Notification.requestPermission().then(permission=>{
    if(permission !== "granted"){
      alert("Allow notifications for reminders");
      return;
    }

    startReminder(time);

    document.getElementById("reminderStatus").innerText =
      "Reminder set for " + time;
  });
}


function startReminder(time){

  if(reminderInterval) clearInterval(reminderInterval);

  reminderInterval = setInterval(()=>{

    const now = new Date();
    const current =
      now.getHours().toString().padStart(2,"0") + ":" +
      now.getMinutes().toString().padStart(2,"0");

    if(current === time){
      showNotification();
    }

  }, 30000); // check every 30s
}


function showNotification(){

  new Notification("Time to train 💪", {
    body: "No excuses. Your streak is waiting.",
    icon: "https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
  });
}


/* Auto start saved reminder */
window.addEventListener("load", ()=>{
  const saved = localStorage.getItem("reminderTime");
  if(saved){
    document.getElementById("reminderTime").value = saved;
    startReminder(saved);
  }
});
  document.getElementById("planOutput").innerText=plan;

  localStorage.setItem("savedPlan", plan);
}
