//timer properties
const timer = {
  pomodoro: 45,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

const buttonSound = new Audio("button-sound.mp3");
const mainButton = document.getElementById("js-btn");
mainButton.addEventListener("click", () => {
  buttonSound.play();
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

//create an event listener that detects a click on the buttons
const modeButtons = document.querySelector("#js-mode-buttons"); // variable points to the containing element
modeButtons.addEventListener("click", handleMode);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime; //difference between current time and end time in milliseconds

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000; //Know in the future when the timer ends

  if (timer.mode === "pomodoro") timer.sessions++;

  mainButton.dataset.action = "stop";
  mainButton.textContent = "Stop";
  mainButton.classList.add("active");

  interval = setInterval(() => {
    //method which executes the callback function every 1000 milliseconds
    timer.remainingTime = getRemainingTime(endTime);
    updateClock(); //invoked to update the countdown to the latest value.

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);

      switch (timer.mode) {
        case "pomodoro":
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchmode("longBreak");
          } else {
            switchmode("shortBreak");
          }
          break;
        default:
          switchmode("pomodoro");
      }

      if (Notification.permission === "granted") {
        const text =
          timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
        new Notification(text);
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();
      startTimer();
    }
  }, 1000);
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");

  min.textContent = minutes;
  sec.textContent = seconds;

  const text =
    timer.mode === "pomodoro" ? "Get back to work" : "Take a break ಠ_ಠ";
  document.title = `${minutes}:${seconds} - ${text}`;

  //Each time updateClock() is invoked, the value attribute of the <progress> element is updated to the result
  const progress = document.getElementById("js-progress");
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

//function adds two new properties to the timer object
function switchmode(mode) {
  timer.mode = mode; //could be pomodoro, shortBreak or longBreak
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  document
    .querySelectorAll("button[data-moode")
    .forEach((e) => e.classList.remode("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;
  document
    .getElementById("js-progress")
    .setAttribute("max", timer.remainingTime.total);

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchmode(mode);
  stopTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  //check if the browser supports notifications
  if ("Notification" in window) {
    // If notification permissions have neither been granted or denied
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // ask the user for permission
      Notification.requestPermission().then(function (permission) {
        // If permission is granted
        if (permission === "granted") {
          // Create a new notification
          new Notification(
            "Awesome! You will be notified at the start of each session"
          );
        }
      });
    }
  }
  switchmode("pomodoro");
});
