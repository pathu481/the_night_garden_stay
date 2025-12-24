if (!localStorage.getItem("adminLoggedIn")) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}

// 🔒 Scoped variable names to avoid collision
const dashboardEnquiries =
  JSON.parse(localStorage.getItem("contactMessages")) || [];

const dashboardReviews =
  JSON.parse(localStorage.getItem("reviews")) || [];

const dashboardBookings =
  JSON.parse(localStorage.getItem("bookings")) || [];

const enquiryEl = document.getElementById("enquiryCount");
const reviewEl = document.getElementById("reviewCount");
const bookingEl = document.getElementById("bookingCount");

if (enquiryEl) enquiryEl.textContent = dashboardEnquiries.length;
if (reviewEl) reviewEl.textContent = dashboardReviews.length;
if (bookingEl) bookingEl.textContent = dashboardBookings.length;

// Optional analytics helpers
if (typeof Analytics !== "undefined") {
  if (
    document.getElementById("totalBookings") &&
    typeof Analytics.bookings === "function"
  ) {
    document.getElementById("totalBookings").innerText =
      Analytics.bookings();
  }

  if (
    document.getElementById("totalLeads") &&
    typeof Analytics.leads === "function"
  ) {
    document.getElementById("totalLeads").innerText =
      Analytics.leads();
  }

  if (
    document.getElementById("approvedReviews") &&
    typeof Analytics.reviews === "function"
  ) {
    document.getElementById("approvedReviews").innerText =
      Analytics.reviews();
  }
}
