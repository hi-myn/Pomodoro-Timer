//timer properties
const timer = {
    pomodoro: 25,
    shortBreak:5,
    longBreak:15,
    longBreakInterval:4,
};

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