/* ---------------- TIMER ---------------- */
let seconds = 0
let interval = null

function startTimer(){
  if(interval) return
  interval = setInterval(()=>{
    seconds++
    let m = String(Math.floor(seconds/60)).padStart(2,"0")
    let s = String(seconds%60).padStart(2,"0")
    document.getElementById("timer").innerText = `${m}:${s}`
  },1000)
}

function stopTimer(){
  clearInterval(interval)
  interval = null
}

function resetTimer(){
  stopTimer()
  seconds = 0
  document.getElementById("timer").innerText="00:00"
}


/* ---------------- STREAK ---------------- */
let streak = localStorage.getItem("streak") || 0
document.getElementById("streak").innerText = streak

function completeWorkout(){
  streak++
  localStorage.setItem("streak", streak)
  document.getElementById("streak").innerText = streak
}


/* ---------------- CALORIES ---------------- */
function saveCalories(){
  let c = document.getElementById("caloriesInput").value
  localStorage.setItem("calories", c)
  document.getElementById("caloriesText").innerText = "Saved: "+c+" kcal"
}


/* ---------------- VOLUME ---------------- */
function calcVolume(){
  let w = document.getElementById("weight").value
  let r = document.getElementById("reps").value
  let volume = w*r
  document.getElementById("volumeResult").innerText="Volume: "+volume+" kg"
}


/* ---------------- INTENSITY ---------------- */
let slider = document.getElementById("intensity")
slider.oninput = ()=> document.getElementById("intensityValue").innerText = slider.value


/* ---------------- SAVE PLAN ---------------- */
function savePlan(){
  let plan = document.getElementById("plan").value
  localStorage.setItem("plan", plan)
  alert("Plan saved")
}


/* ---------------- QUESTION ---------------- */
function saveQuestion(){
  let q = document.getElementById("question").value
  localStorage.setItem("question", q)
  alert("Question saved")
}


/* ---------------- MUSIC ---------------- */
document.getElementById("musicFile").onchange = function(e){
  let file = URL.createObjectURL(e.target.files[0])
  document.getElementById("player").src = file
}
