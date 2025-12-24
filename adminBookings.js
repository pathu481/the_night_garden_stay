/* adminBookings.js
   Clean Admin Dashboard Script
   Source of truth: BACKEND ONLY
*/

(() => {
  const API_URL = "http://localhost:5000/api/bookings";

  const tbody = document.querySelector("#bookingsTable tbody");
  const totalEl = document.getElementById("totalBookings");

  /* ================= FETCH BOOKINGS ================= */

  async function fetchBookingsFromApi() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();

      if (Array.isArray(data)) return data;
      if (Array.isArray(data.bookings)) return data.bookings;

      return [];
    } catch (err) {
      console.error("❌ API ERROR:", err);
      return [];
    }
  }

  /* ================= RENDER BOOKINGS ================= */

  function renderBookings(bookings) {
    tbody.innerHTML = "";

    if (!bookings.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align:center;color:#999">
            No bookings found
          </td>
        </tr>`;
      totalEl.innerText = "0";
      return;
    }

    bookings.forEach((b, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${b.name || ""}</td>
        <td>${b.email || ""}</td>
        <td>${b.phone || ""}</td>
        <td>${b.checkin || ""}</td>
        <td>${b.checkout || ""}</td>
        <td>${b.guests || ""}</td>
        <td>${b.message || ""}</td>
        <td>${b.paymentAmount || b.amount || "—"}</td>
        <td>
          <span class="status ${b.status || "pending"}">
            ${b.status || "pending"}
          </span>
        </td>
        <td>${formatTime(b.createdAt)}</td>
        <td>
          <button class="approve" data-id="${b._id}">Approve</button>
          <button class="reject" data-id="${b._id}">Reject</button>
          <button class="delete" data-id="${b._id}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    totalEl.innerText = bookings.length;
    bindActions();
  }

  /* ================= ACTIONS ================= */

  function bindActions() {
    document.querySelectorAll(".approve").forEach(btn => {
      btn.onclick = () => updateStatus(btn.dataset.id, "approved");
    });

    document.querySelectorAll(".reject").forEach(btn => {
      btn.onclick = () => updateStatus(btn.dataset.id, "rejected");
    });

    document.querySelectorAll(".delete").forEach(btn => {
      btn.onclick = () => deleteBooking(btn.dataset.id);
    });
  }

  async function updateStatus(id, status) {
    if (!confirm(`Mark booking as ${status}?`)) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error("Update failed");

      fetchAndRender();
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking permanently?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchAndRender();
    } catch (err) {
      alert("Failed to delete booking");
      console.error(err);
    }
  }

  /* ================= HELPERS ================= */

  function formatTime(time) {
    if (!time) return "—";
    return new Date(time).toLocaleString();
  }

  function fetchAndRender() {
    fetchBookingsFromApi().then(renderBookings);
  }

  /* ================= INIT ================= */

  document.addEventListener("DOMContentLoaded", fetchAndRender);

})();
