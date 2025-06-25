// icon drag and drop property
let isDragging = false;
let currentIcon = null;
let offsetX = 0;
let offsetY = 0;

const desktop = document.getElementById("desktop");

desktop.querySelectorAll(".icon").forEach((icon) => {
  icon.addEventListener("mousedown", (e) => {
    isDragging = true;
    currentIcon = icon;

    // Calculate offset between cursor and icon corner
    const rect = icon.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    icon.style.zIndex = 1000; // bring dragged icon on top
    icon.style.cursor = "grabbing";
  });
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && currentIcon) {
    currentIcon.style.position = "absolute";
    currentIcon.style.left = `${e.clientX - offsetX}px`;
    currentIcon.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    currentIcon.style.cursor = "grab";
    currentIcon = null;
  }
});

// ---------rename functionality code on everyicon
// Enable rename on double-click of <p>
document.querySelectorAll(".icon p").forEach((p) => {
  p.addEventListener("dblclick", () => {
    const currentText = p.innerText;
    const input = document.createElement("input");
    input.className = "rename-input";
    input.type = "text";
    input.value = currentText;

    // Replace <p> with input
    const parent = p.parentElement;
    parent.replaceChild(input, p);
    input.focus();
    input.select();

    // Save on Enter or blur
    const saveName = () => {
      const newName = input.value.trim() || currentText; // fallback to old name if empty
      const newP = document.createElement("p");
      newP.style.color = "white";
      newP.innerText = newName;

      // Rebind rename listener
      newP.addEventListener("dblclick", () => {
        // recursion for re-renaming
        parent.replaceChild(input, newP);
        input.value = newName;
        input.focus();
        input.select();
      });

      parent.replaceChild(newP, input);
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveName();
      }
    });

    input.addEventListener("blur", saveName);
  });
});

// Drag and drop property
function openThisPC() {
  const win = document.getElementById("thisPCWindow");
  win.style.display = "block";
}

function closeWindow(id) {
  document.getElementById(id).style.display = "none";
}

// Clock
// function updateClock() {
//   const clock = document.getElementById("clock");
//   const now = new Date();
//   clock.innerText = now.toLocaleTimeString();
// }
// setInterval(updateClock, 1000);
// updateClock();

// Dragging icons
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

// date and time functionality to show on taskbar
function updateSystemTray() {
  const time = document.getElementById("time");
  const date = document.getElementById("date");

  const now = new Date();

  const optionsTime = { hour: "2-digit", minute: "2-digit" };
  const optionsDate = { day: "numeric", month: "long", year: "numeric" };

  time.innerText = now.toLocaleTimeString("en-US", optionsTime);
  date.innerText = now.toLocaleDateString("en-US", optionsDate);
}

setInterval(updateSystemTray, 1000);
updateSystemTray();

// when click on date and
const timeElem = document.getElementById("clock");
const calendar = document.getElementById("calendar-container");
const monthYear = document.getElementById("monthYear");
const grid = document.getElementById("calendar-grid");
const hoverInfo = document.getElementById("hover-info");
let currentDate = new Date();

timeElem.addEventListener("click", () => {
  calendar.classList.toggle("show");
});

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // Day of week (0-6)
  const lastDate = new Date(year, month + 1, 0).getDate(); // Last date of month

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthYear.innerText = `${monthNames[month]} ${year}`;
  grid.innerHTML = "";

  // Add empty days before the first date
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // Add day numbers
  const today = new Date();

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerText = day;

    const fullDate = new Date(year, month, day);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // ✅ Highlight today's date
    if (
      fullDate.getDate() === today.getDate() &&
      fullDate.getMonth() === today.getMonth() &&
      fullDate.getFullYear() === today.getFullYear()
    ) {
      dayDiv.style.backgroundColor = "#00aaff";
      dayDiv.style.color = "#fff";
      dayDiv.style.fontWeight = "bold";
    }

    dayDiv.addEventListener("mouseover", () => {
      hoverInfo.innerText = fullDate.toLocaleDateString("en-US", options);
    });

    dayDiv.addEventListener("mouseleave", () => {
      hoverInfo.innerText = "";
    });

    grid.appendChild(dayDiv);
  }
}

renderCalendar(currentDate);

// Hover on date and Time
const timeSpan = document.getElementById("time");
const dateSpan = document.getElementById("date");
const tooltip = document.getElementById("time-tooltip");

const updateHoverTooltip = () => {
  const now = new Date();
  const full = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  tooltip.innerText = full;
};

// Show tooltip
function showTooltip() {
  updateHoverTooltip();
  tooltip.style.display = "block";
}

// Hide tooltip
function hideTooltip() {
  tooltip.style.display = "none";
}

// Add hover listeners to both time and date spans
[timeSpan, dateSpan].forEach((el) => {
  el.addEventListener("mouseenter", showTooltip);
  el.addEventListener("mouseleave", hideTooltip);
});
