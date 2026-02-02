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
