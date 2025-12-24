/*
  reviews.js
  Clean & controlled review system
  - Stores reviews in localStorage
  - Shows ONLY approved + pending reviews
  - NEVER shows rejected reviews
  - Prevents double submit
*/

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reviewForm");
  const reviewsGrid = document.querySelector(".reviews-grid");
  const approvedContainer = document.getElementById("approvedReviews");
  const msgEl = document.getElementById("reviewMsg");

  /* ---------------- UTIL ---------------- */

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  function getReviews() {
    return JSON.parse(localStorage.getItem("reviews")) || [];
  }

  function saveReviews(reviews) {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }

  /* ---------------- RENDER ---------------- */

  function renderReviews() {
    const reviews = getReviews();

    if (reviewsGrid) reviewsGrid.innerHTML = "";
    if (approvedContainer) approvedContainer.innerHTML = "";

    reviews.forEach(review => {

      // ❌ NEVER show rejected reviews
      if (review.status === "rejected") return;

      // 🌐 Public review cards (approved + pending)
      if (reviewsGrid) {
        const card = document.createElement("div");
        card.className = "review-card";

        const statusTag =
          review.status === "pending"
            ? `<em class="pending-tag">(Pending)</em>`
            : "";

        card.innerHTML = `
          <div class="stars">${escapeHTML(review.rating)}</div>
          <p class="review-text">${escapeHTML(review.text)}</p>
          <span class="reviewer">— ${escapeHTML(review.name)} ${statusTag}</span>
        `;

        reviewsGrid.appendChild(card);
      }

      // ⭐ Approved reviews section (optional block)
      if (review.status === "approved" && approvedContainer) {
        const div = document.createElement("div");
        div.className = "approved-review";
        div.innerHTML = `
          <strong>${escapeHTML(review.name)}</strong>
          <p>${escapeHTML(review.text)}</p>
        `;
        approvedContainer.appendChild(div);
      }
    });
  }

  renderReviews();

  /* ---------------- SUBMIT ---------------- */

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = form.querySelector("input")?.value.trim() || "Guest";
    const rating = form.querySelector("select")?.value;
    const text = form.querySelector("textarea")?.value.trim();

    if (!rating || !text) return;

    const reviews = getReviews();

    reviews.push({
      name,
      rating,
      text,
      status: "pending",
      createdAt: new Date().toISOString()
    });

    saveReviews(reviews);

    if (msgEl) {
      msgEl.innerText =
        "✅ Thank you! Your review will be visible after approval.";
    }

    form.reset();

    // 🔒 prevent double submit
    form.querySelector("button").disabled = true;

    renderReviews();
  }, { once: true });

});
