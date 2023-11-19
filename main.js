const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const period = document.getElementById('period');

const dayname = document.getElementById('dayname');
const month = document.getElementById('month');
const daynum = document.getElementById('daynum');
const year = document.getElementById('year');

const weekDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

setInterval(function() {
    const dateTime = new Date();

    hours.innerText = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
    minutes.innerText = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
    seconds.innerText = dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds();
    dateTime.getHours > 12 ? period.innerText = 'PM' : period.innerText = 'AM';

    dayname.innerText = dateTime.getDate();
    month.innerText = Number(dateTime.getMonth()) + 1;
    daynum.innerText = weekDays[dateTime.getDay()];
    year.innerText = dateTime.getFullYear();
}, 1000);



let currentControl = 'stop';
let intervalId;
let timerMode = 'pomodoro';
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');

const pomodoro   = 1500;
const shortBreak = 300;
const longBreak  = 900;

let timerPeriod = pomodoro;

const setTimer = () => {
    timerMinutes.innerText =  Math.floor(timerPeriod / 60) < 10 ? '0' + Math.floor(timerPeriod / 60) : Math.floor(timerPeriod / 60);
    timerSeconds.innerText = timerPeriod % 60 < 10 ? '0' + timerPeriod % 60 : timerPeriod % 60;
}

setTimer();

const currentMode = (mode) => {
    if(mode === 'pomodoro') {
        pomodoroEl.classList.add("glow");
        shortBreakEl.classList.remove("glow");
        longBreakEl.classList.remove("glow");
    } else if(mode === 'shortBreak') {
        pomodoroEl.classList.remove("glow");
        shortBreakEl.classList.add("glow");
        longBreakEl.classList.remove("glow");
    } else {
        pomodoroEl.classList.remove("glow");
        shortBreakEl.classList.remove("glow");
        longBreakEl.classList.add("glow");
    }
}

const skipTimer = () => {
    clearInterval(intervalId);
    if(timerMode === 'pomodoro') {
        timerPeriod = shortBreak;
        timerMode = 'shortBreak';
        currentMode(timerMode);
    } else if(timerMode === 'shortBreak') {
        timerPeriod = longBreak;
        timerMode = 'longBreak';
        currentMode(timerMode);
    } else {
        timerPeriod = pomodoro;
        timerMode = 'pomodoro';
        currentMode(timerMode);
    }
}

function playAudio(sound) {
    let audio = new Audio(sound);
    audio.play();
}

let counter = 0;
const changeTimerMode = () => {
    if(counter === 4) {
        timerPeriod = longBreak;
        timerMode = 'longBreak';
        currentMode(timerMode);
        counter = 0;
        playAudio("./mp3/call-to-attention.mp3");
        return;
    }

    if(timerMode === 'pomodoro') {
        timerPeriod = shortBreak;
        timerMode = 'shortBreak';
        counter += 1;
        playAudio("./mp3/ding.mp3");
    } else if(timerMode === 'shortBreak' || timerMode === 'longBreak') {
        timerPeriod = pomodoro;
        timerMode = 'pomodoro';
        playAudio("./mp3/ding.mp3");
    }
    currentMode(timerMode);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const runTimer = () => {
    intervalId = setInterval(async function() {
        timerPeriod -= 1;
        setTimer();
        if(timerPeriod == 0) {
            clearInterval(intervalId);
            await sleep(1000);
            changeTimerMode();
            setTimer();
            currentControl = 'start';
            runTimer();
            return;
        }
    }, 1000);
}

const pomodoroEl = document.querySelector('.pomodoro');
const shortBreakEl = document.querySelector('.shortBreak');
const longBreakEl = document.querySelector('.longBreak');
const modes = [pomodoroEl, shortBreakEl, longBreakEl];

modes.forEach((mode) => {
    mode.addEventListener("click", function (e) {
        if(e.target.classList.contains("pomodoro")) {
            timerPeriod = pomodoro;
            timerMode = 'pomodoro';
            currentMode(timerMode);
            clearInterval(intervalId);
            currentControl = 'stop';
        } else if (e.target.classList.contains("shortBreak")) {
            timerPeriod = shortBreak;
            timerMode = 'shortBreak';
            currentMode(timerMode);
            clearInterval(intervalId);
            currentControl = 'stop';
        } else if (e.target.classList.contains("longBreak")) {
            timerPeriod = longBreak;
            timerMode = 'longBreak';
            currentMode(timerMode);
            clearInterval(intervalId);
            currentControl = 'stop';
        }
        setTimer();
    });
});

const stop = document.querySelector('.stop');
const start = document.querySelector('.start');
const skip = document.querySelector('.skip');
const controls = [stop, start, skip];

controls.forEach((control) => {
    control.addEventListener("click", function (e) {
        if(e.target.classList.contains("stop")) {
            if(currentControl != 'stop') {
                clearInterval(intervalId);
                currentControl = 'stop';
            }
        } else if (e.target.classList.contains("start")) {
            if(currentControl != 'start') {
                runTimer();
                currentControl = 'start';
            }
        } else if (e.target.classList.contains("skip")) {
            skipTimer();
            currentControl = 'stop';
        }
        setTimer();
    });
});
