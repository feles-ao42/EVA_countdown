let time = 5 * 60 * 1000;
let remainingTime = null;
let startTime = null;
let timerId = null;
let isCountdownTimer = true;
const maxMinutes = 10000000;

let targetDate = null;

const internalButton = document.getElementById("internal-button");
const externalButton = document.getElementById("external-button");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const setupButton = document.getElementById("setup-button");

const updateTimeText = (time) => {
    const totalSeconds = Math.floor(time / 1000);
    const h = Math.floor(totalSeconds / 3600) % 1000;
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const ms = time % 1000;

    const formattedH = `0${h}`.slice(-3);
    const formattedM = `0${m}`.slice(-2);
    const formattedS = `0${s}`.slice(-2);
    const formattedMs = `00${ms}`.slice(-3).slice(0, 2);

    setTimer(formattedH, formattedM, formattedS, formattedMs);
};

const getTargetDate = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const daytime = urlParams.get("daytime");
    if (!daytime || daytime.length !== 12) return null;

    const year = parseInt(daytime.substring(0, 4));
    const month = parseInt(daytime.substring(4, 6)) - 1;
    const day = parseInt(daytime.substring(6, 8));
    const hour = parseInt(daytime.substring(8, 10));
    const minute = parseInt(daytime.substring(10, 12));

    return new Date(year, month, day, hour, minute);
};

const setTimer = (h, m, s, ms) => {
  document.getElementById("hour").textContent = h;
  document.getElementById("minute").textContent = m;
  document.getElementById("second").textContent = s;
  document.getElementById("millisecond").textContent = ms;
};

const update = () => {
    timerId = setTimeout(() => {
        const now = Date.now();
        remainingTime = targetDate.getTime() - now;

        if (remainingTime > 0) {
            updateTimeText(remainingTime);
            update();
        } else {
            remainingTime = 0;
            updateTimeText(remainingTime);
        }
    }, 10);
};

const internalAction = () => {
  isCountdownTimer = true;
  resetAction();
  internalButton.classList.remove("disabled");
  externalButton.classList.add("disabled");
  setupButton.classList.add("active-control");
};

const externalAction = () => {
  isCountdownTimer = false;
  resetAction();
  externalButton.classList.remove("disabled");
  internalButton.classList.add("disabled");
  setupButton.classList.remove("active-control");
};

const startAction = () => {
    if (timerId !== null || !targetDate) return;
    update();
    startButton.classList.remove("active-control");
    stopButton.classList.add("active-control");
};

const stopAction = () => {
    if (timerId === null) return;
    clearTimeout(timerId);
    timerId = null;
    stopButton.classList.remove("active-control");
    startButton.classList.add("active-control");
};

const resetAction = () => {
    if (!targetDate) return;
    remainingTime = targetDate.getTime() - Date.now();
    updateTimeText(remainingTime);
};

const setupAction = () => {
  if (!isCountdownTimer) return;

  time += 1 * 60 * 1000;
  time %= maxMinutes * 60 * 1000;

  resetAction();
};

(() => {
    startButton.addEventListener("click", startAction);
    stopButton.addEventListener("click", stopAction);
    resetButton.addEventListener("click", resetAction);

    const urlParams = new URLSearchParams(window.location.search);
    let titlevalue = urlParams.get("title");
    if (titlevalue == null){
        titlevalue = "締切まで"
    }

    document.getElementById("title").textContent = titlevalue;

    targetDate = getTargetDate();
    if (targetDate) {
        resetAction();
        startAction();
    }
})();
