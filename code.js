// Game state
let counter = 0;
let extra = 0;
let multi = 1;
let autoClickers = 0;
let logCounter = 0;

let extracost = 1;
let multicost = 5;
let autoclickcost = 20;

let darkMode = false;
let devMode = false;

let devLoggedIn = false;

// UI elements
const counterDisplay = document.getElementById("counter");
const clickValueDisplay = document.getElementById("clickValue");
const cpsDisplay = document.getElementById("cps");
const extraBtn = document.getElementById("buyExtra");
const multiBtn = document.getElementById("buyMulti");
const autoClickerBtn = document.getElementById("buyAuto");
const themeToggleBtn = document.getElementById("toggleTheme");
const devPromptBtn = document.getElementById("devAccessBtn");
const devTools = document.getElementById("devTools");
const resetBtn = document.getElementById("resetBtn");
const logOutput = document.getElementById("logOutput");

// Logging function
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const fullMessage = `[${timestamp}] ${message}`;
  console.log(fullMessage);
  if (logOutput) {
    logOutput.textContent += fullMessage + "\n";
    const container = document.getElementById("logContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}

// Load from localStorage
function loadGame() {
  const saved = JSON.parse(localStorage.getItem("clickerGame"));
  if (saved) {
    ({ counter, extra, multi, autoClickers, extracost, multicost, autoclickcost, darkMode } = saved);
    if (!darkMode) {
      document.body.classList.remove("light"); // Dark mode
    } else {
      document.body.classList.add("light"); // Light mode
    }
  }
  updateUI();
}

// Save to localStorage
function saveGame() {
  localStorage.setItem("clickerGame", JSON.stringify({
    counter, extra, multi, autoClickers,
    extracost, multicost, autoclickcost, darkMode
  }));
}

// Update UI
function updateUI() {
  counterDisplay.textContent = `Points: ${counter}`;
  clickValueDisplay.textContent = `+${multi + extra} per click`;
  cpsDisplay.textContent = `${(autoClickers * (multi + extra))} clicks/sec`;

  extraBtn.innerHTML = `+1 Extra (<span id="extraCost">${extracost}</span>)`;
  multiBtn.innerHTML = `+1 Multi (<span id="multiCost">${multicost}</span>)`;
  autoClickerBtn.innerHTML = `+1 Auto Clicker (<span id="autoCost">${autoclickcost}</span>)`;

  saveGame();
}

// Manual click
document.getElementById("clickBtn").addEventListener("click", () => {
  counter += multi + extra;
  log(`[User] Clicked: +${multi + extra}, Total: ${counter}`);
  updateUI();
});

// Purchase Extra
extraBtn.addEventListener("click", () => {
  if (counter >= extracost) {
    counter -= extracost;
    extra += 1;
    log(`[Shop] Bought +1 Extra for ${extracost}`);
    extracost += 2;
    updateUI();
  } else {
    log("[Shop] Not enough points for Extra");
  }
});

// Purchase Multi
multiBtn.addEventListener("click", () => {
  if (counter >= multicost) {
    counter -= multicost;
    multi += 1;
    log(`[Shop] Bought +1 Multi for ${multicost}`);
    multicost += 10;
    updateUI();
  } else {
    log("[Shop] Not enough points for Multi");
  }
});

// Purchase Auto Clicker
autoClickerBtn.addEventListener("click", () => {
  if (counter >= autoclickcost) {
    counter -= autoclickcost;
    autoClickers += 1;
    log(`[Shop] Bought Auto Clicker for ${autoclickcost}`);
    autoclickcost = Math.floor(autoclickcost * 1.5);
    updateUI();
  } else {
    log("[Shop] Not enough points for Auto Clicker");
  }
});

// Theme toggle
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  darkMode = document.body.classList.contains("light");
  log(`[User] Toggled theme: ${darkMode ? "Light" : "Dark"}`);
  updateUI();
});

// Developer prompt
devPromptBtn.addEventListener("click", () => {
  if (devLoggedIn === false){
  log("[Dev] Prompted for password");
  const pass = prompt("Enter developer password:");
  if (pass === "1234") {
    devLoggedIn = true;
    devMode = true;
    devTools.classList.remove("hidden");
    log("[Dev] Access granted");
  } else {
    log("[Dev] Access denied (incorrect password)");
  }
  } else {
    log("[dev] Logged out of DevMode");
    devLoggedIn = false;
    devTools.classList.add("hidden");
  }
});

// Reset game
resetBtn.addEventListener("click", () => {
  counter = 0;
  extra = 0;
  multi = 1;
  autoClickers = 0;
  extracost = 1;
  multicost = 5;
  autoclickcost = 20;
  log("[Dev] Game reset to default values");
  updateUI();
});

// Auto-clicker loop
setInterval(() => {
  if (autoClickers > 0) {
    const clicks = (multi + extra) * autoClickers;
    counter += clicks;
    logCounter += 1;
    if (logCounter === 10){
      log(`[Auto] Added ${10*clicks} points from ${autoClickers} auto-clicker(s)`);
      logCounter = 0;
    }
    updateUI();
  }
}, 1000);

// log(`[Auto] Added ${clicks} points from ${autoClickers} auto-clicker(s)`);

// Init
loadGame();
