/* availability.js - clean calendar + booking selection
   - generates a grid with data-date on each day
   - clicking two available days will store checkin/checkout in localStorage
     and navigate to booking page
   - respects booked / blocked lists and tries to read from Storage helper
*/

// ===== CONFIG (defaults, may be overridden from Storage helper) =====
let bookedDates = ["2025-12-20","2025-12-21","2025-12-25"];
let blockedDates = ["2025-12-31"];

let selectedStart = null;
let selectedEnd = null;

// ===== CURRENT VIEW =====
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// ===== ELEMENTS =====
const calendarContainer = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

// Try to get dynamic lists from Storage helper (graceful fallback)
try {
  if (typeof Storage !== 'undefined' && Storage.get) {
    const sBooked = Storage.get('bookedDates');
    const sBlocked = Storage.get('blockedDates');
    if (Array.isArray(sBooked) && sBooked.length) bookedDates = sBooked;
    if (Array.isArray(sBlocked) && sBlocked.length) blockedDates = sBlocked;
  }
} catch (err) {
  // ignore and use defaults/local arrays
}

// ===== GENERATE CALENDAR =====
function generateCalendar(month = currentMonth, year = currentYear) {
  if (!calendarContainer) return;
  calendarContainer.innerHTML = "";

  const monthNames = ["January","February","March","April","May","June",
                      "July","August","September","October","November","December"];
  monthYearEl.innerText = `${monthNames[month]} ${year}`;

  // First weekday of month
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Empty slots for first day
  for (let i = 0; i < firstDay; i++) {
    const emptyEl = document.createElement("div");
    calendarContainer.appendChild(emptyEl);
  }

  // Generate day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = dateObj.toISOString().split('T')[0];

    const dayEl = document.createElement("div");
    dayEl.classList.add("calendar-day");
    dayEl.dataset.date = dateStr;
    dayEl.innerText = day;

    if (bookedDates.includes(dateStr)) {
      dayEl.classList.add("booked");
    } else if (blockedDates.includes(dateStr)) {
      dayEl.classList.add("blocked");
    } else {
      dayEl.classList.add("available");
      dayEl.addEventListener('click', () => handleDayClick(dateStr, dayEl));
    }

    calendarContainer.appendChild(dayEl);
  }
}

// ===== DAY CLICK HANDLING =====
function handleDayClick(dateStr, el) {
  // Toggle selections: choose start then end; when both chosen, store and navigate
  if (!selectedStart) {
    selectedStart = dateStr;
    el.style.boxShadow = "0 0 15px var(--accent)";
    return;
  }

  if (!selectedEnd) {
    // ensure end is not before start
    if (dateStr < selectedStart) {
      // swap
      selectedEnd = selectedStart;
      selectedStart = dateStr;
    } else {
      selectedEnd = dateStr;
    }
    highlightRange(selectedStart, selectedEnd);

    // save to localStorage and navigate to booking page
    localStorage.setItem('checkin', selectedStart);
    localStorage.setItem('checkout', selectedEnd);
    // slight delay so user sees visual highlight, then navigate
    setTimeout(() => window.location.href = 'booking.html', 350);
    return;
  }

  // if both already set, reset and start new selection
  resetSelection();
  selectedStart = dateStr;
  el.style.boxShadow = "0 0 15px rgba(255,77,77,0.8)";
  selectedEnd = null;
}

function highlightRange(start, end) {
  document.querySelectorAll('.calendar-day.available').forEach(el => {
    el.style.boxShadow = '';
    const d = el.dataset.date;
    if (d >= start && d <= end) {
      el.style.boxShadow = '0 0 20px rgba(255,77,77,0.9)';
    }
  });
}

function resetSelection() {
  selectedStart = null;
  selectedEnd = null;
  document.querySelectorAll('.calendar-day').forEach(el => el.style.boxShadow = '');
}

// ===== NAVIGATION =====
if (prevBtn) prevBtn.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  generateCalendar(currentMonth, currentYear);
});

if (nextBtn) nextBtn.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  generateCalendar(currentMonth, currentYear);
});

// ===== INIT =====
generateCalendar();

// If other scripts provide blocked/booked updates via Storage helper later,
// you could call generateCalendar() again to refresh.

