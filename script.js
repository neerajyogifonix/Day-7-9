import { debounce, throttle } from "./utility.js";

// --------- Utility Logger ---------
function createLogger(outputId) {
  const panel = document.getElementById(outputId); // Closure
  return (...args) => {
    const msg = args.join(" ");
    const line = document.createElement("div");
    line.className = "log-line";
    line.textContent = msg;
    panel.appendChild(line);
    panel.scrollTop = panel.scrollHeight;
    console._originalLog(...args);
  };
}
console._originalLog = console.log; // keep native log

// loggers for each section
const logDebounce = createLogger("output-debounce");
const logCurrying = createLogger("output-currying");
const logAsync = createLogger("output-async");
const logDelegation = createLogger("output-delegation");
const logTraversal = createLogger("output-traversal");
const logFetch = createLogger("output-fetch");

// ---------------- Spread, Rest , Destructuring ----------------
let arr = [2, 5, 6, 8, 7, 9];
let { a, b } = { a: 5, b: 6 };
logCurrying("Destructuring:", a, b);

let obj = { ...arr };
logCurrying("Spread array into object:", JSON.stringify(obj));

let obj2 = { name: "user2", age: 20, gender: "male" };
let updatedObj = { ...obj2, age: 50 };
logCurrying("Updated object with spread:", JSON.stringify(updatedObj));

// ---------------- Debouncing ----------------
let debouncingInput = document.querySelector("#debouncingInput");
let search = (val) => logDebounce("Searching for:", val);
let debounceSearch = debounce(search, 1000);

debouncingInput.addEventListener("input", () => {
  debounceSearch(debouncingInput.value);
});

// ---------------- Throttling ----------------
let throttlingInput = document.querySelector("#throttlingInput");
let clicked = () => logDebounce("Button Clicked!");
let debounceClicked = throttle(clicked, 2000);

throttlingInput.addEventListener("click", () => {
  debounceClicked();
});

// ---------------- Currying ----------------
function addition(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}
logCurrying("Curried Addition:", addition(5)(2)(1));

let userObj = { name: "neeraj", age: 5 };
function userInfo(obj) {
  return function (userinfo) {
    return obj[userinfo];
  };
}
logCurrying("User Info:", userInfo(userObj)("name"));

const curriedMultiply = (a) => (b) => a * b;
logCurrying("Curried Multiply:", curriedMultiply(2)(5));

// ---------------- Callbacks, Promises, Async Await ----------------
let head = document.querySelector("#color-heading");
let colorButton = document.querySelector("#color-btn");

function changeColor(color, delay) {
  let internet = Math.floor(Math.random() * 10) + 1;
  return new Promise((resolve, reject) => {
    if (internet > 1) {
      setTimeout(() => {
        head.style.color = color;
        resolve(`Color changed to ${color}`);
      }, delay);
    } else {
      reject("Color not changed (Network issue)");
    }
  });
}

async function changeColorExecuter() {
  try {
    logAsync(await changeColor("yellow", 1000));
    logAsync(await changeColor("pink", 1000));
    logAsync(await changeColor("green", 1000));
    logAsync(await changeColor("purple", 1000));
    logAsync(await changeColor("cyan", 1000));
    logAsync("No error encountered, catch block won't execute");
  } catch (e) {
    logAsync("Error caught:", e);
  } finally {
    logAsync("Finally block executed.");
  }
}

colorButton.addEventListener("click", () => {
  changeColorExecuter();
});

// ---------------- Fetch / Axios Section ----------------
const countryInput = document.querySelector("#country-input");
const fetchBtn = document.querySelector("#fetch-btn");
const universityList = document.querySelector("#university-list");

fetchBtn.addEventListener("click", async () => {
  const country = countryInput.value.trim();
  if (!country) {
    logFetch("⚠️ Please enter a country name");
    return;
  }
  logFetch("🔍 Searching universities for:", country);

  try {
    // Using AllOrigins proxy to bypass HTTPS issue
    const proxyURL = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `http://universities.hipolabs.com/search?country=${country}`
    )}`;
    const response = await axios.get(proxyURL);
    const data = JSON.parse(response.data.contents);

    logFetch("✅ Data received:", data.length, "universities");
    renderUniversities(data);
  } catch (e) {
    logFetch("❌ Error fetching data:", e.message);
  }
});

function renderUniversities(data) {
  universityList.innerHTML = ""; // clear old data
  data.forEach((uni, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${uni.name}`;
    universityList.appendChild(li);
    logFetch("🏫 University:", uni.name);
  });
}

// ---------------- Event Delegation ----------------
const addNoteButton = document.getElementById("add-note-btn");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");

function addNote() {
  const noteText = noteInput.value.trim();
  if (noteText) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const noteContent = document.createElement("span");
    noteContent.textContent = noteText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    noteDiv.appendChild(noteContent);
    noteDiv.appendChild(deleteButton);
    notesList.appendChild(noteDiv);

    logDelegation("Note added:", noteText);
    noteInput.value = "";
  }
}

addNoteButton.addEventListener("click", addNote);
notesList.addEventListener("click", (event) => {
  if (event.target && event.target.tagName === "BUTTON") {
    const noteDiv = event.target.parentNode;
    logDelegation("Note deleted:", noteDiv.querySelector("span").textContent);
    notesList.removeChild(noteDiv);
  }
});

// ---------------- DOM Traversal ----------------
const addNoteButtonTraversal = document.getElementById("add-note-btn-traversal");
const noteInputTraversal = document.getElementById("note-input-traversal");
const notesListTraversal = document.getElementById("notes-list-traversal");

addNoteButtonTraversal.addEventListener("click", function () {
  const noteText = noteInputTraversal.value.trim();
  if (noteText) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const noteContent = document.createElement("span");
    noteContent.textContent = noteText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    noteDiv.appendChild(noteContent);
    noteDiv.appendChild(deleteButton);
    notesListTraversal.appendChild(noteDiv);

    logTraversal("Note added (Traversal):", noteText);
    noteInputTraversal.value = "";

    deleteButton.addEventListener("click", function () {
      logTraversal("Note deleted (Traversal):", noteText);
      notesListTraversal.removeChild(noteDiv);
    });
  }
});

// Log all notes every 5s
function logNoteContents() {
  const notes = document.querySelectorAll("#notes-list-traversal .note");
  notes.forEach((note) => {
    const noteText = note.querySelector("span").textContent;
    logTraversal("Traversal Note Log:", noteText);
  });
}
setInterval(logNoteContents, 5000);
