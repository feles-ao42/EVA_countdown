let time = 5 * 60 * 1000;
let remainingTime = null;
let startTime = null;
let timerId = null;
let isCountdownTimer = true;
const maxMinutes = 10000000;

const internalButton = document.getElementById("internal-button");
const externalButton = document.getElementById("external-button");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const setupButton = document.getElementById("setup-button");

const updateTimeText = (time) => {
  let h = Math.floor(time / (1000 * 60 * 60)) % 100;
  let m = Math.floor(time / (1000 * 60)) % 60;
  let s = Math.floor((time % (1000 * 60)) / 1000);
  let ms = time % 1000;

  h = `0${h}`.slice(-2);
  m = `0${m}`.slice(-2);
  s = `0${s}`.slice(-2);
  ms = `00${ms}`.slice(-3).slice(0, 2);

  setTimer(h, m, s, ms);
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
    if (isCountdownTimer) {
      remainingTime -= now - startTime;
    } else {
      remainingTime += now - startTime;
    }
    startTime = now;
    if (remainingTime > 0) {
      update();
    } else {
      remainingTime = 0;
    }
    updateTimeText(remainingTime);
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
  if (timerId !== null) return;

  startTime = Date.now();
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
  if (isCountdownTimer) {
    remainingTime = time;
  } else {
    remainingTime = 0;
  }
  updateTimeText(remainingTime);
};

const setupAction = () => {
  if (!isCountdownTimer) return;

  time += 1 * 60 * 1000;
  time %= maxMinutes * 60 * 1000;

  resetAction();
};

(() => {
  internalButton.addEventListener("click", internalAction);
  externalButton.addEventListener("click", externalAction);
  startButton.addEventListener("click", startAction);
  stopButton.addEventListener("click", stopAction);
  resetButton.addEventListener("click", resetAction);
  setupButton.addEventListener("click", setupAction);

  const isNumber = (value) => typeof value === "number" && isFinite(value);

  const urlParams = new URLSearchParams(window.location.search);
  const timeParam = parseFloat(urlParams.get("time"), 10);
  if (isNumber(timeParam) && 0 <= timeParam && timeParam < maxMinutes) {
    time = timeParam * 60 * 1000;
  }

  const isStopwatch = urlParams.get("stopwatch");
  if (isStopwatch !== null) {
    externalAction();
  }

  resetAction();
})();
