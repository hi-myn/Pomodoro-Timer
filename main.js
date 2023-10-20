//timer properties
const timer = {
    pomodoro: 25,
    shortBreak:5,
    longBreak:15,
    longBreakInterval:4,
};

let interval;

const mainButton = document.getElementById('js-btn')
mainButton.addEventListener("click", ()=>{
    const { action } = mainButton.dataset;
    if(action === 'start') {
        startTimer()
    }
})


function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date())
    const difference = endTime - currentTime //difference between current time and end time in milliseconds

    const total = Number.parseInt(difference / 1000, 10)
    const minutes = Number.parseInt((total / 60) % 60, 10)
    const seconds = Number.parseInt(total % 60, 10)

    return {
        total,
        minutes,
        seconds,
    }
}

function startTimer(){
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000; //Know in the future when the timer ends

    mainButton.dataset.action = 'stop'
    mainButton.textContent = 'Stop';
    mainButton.classList.add('active')

    interval = setInterval(() => {
        //method which executes the callback function every 1000 milliseconds 
        timer.remainingTime = getRemainingTime(endTime)
        updateClock();//invoked to update the countdown to the latest value.

        total = timer.remainingTime.total;
        if (total <=0) {
            clearInterval(interval);
        }
    }, 1000);
}

function updateClock(){
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2,'0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');

    min.textContent = minutes
    sec.textContent = seconds;
}

//function adds two new properties to the timer object
function switchmode(mode){
    timer.mode = mode; //could be pomodoro, shortBreak or longBreak
    timer.remainingTime = {
        total:timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }

    document
    .querySelectorAll('button[data-moode')
    .forEach(e => e.classList.remode('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock()
};

//create an event listener that detects a click on the buttons
const modeButtons = document.querySelector('#js-mode-buttons'); // variable points to the containing element
modeButtons.addEventListener('click', handleMode);

function handleMode(event){
    const { mode } = event.target.dataset;

    if(!mode) return;

    switchmode(mode)
}

document.addEventListener("DOMContentLoaded", ()=>{
    switchmode('pomodoro')
})
