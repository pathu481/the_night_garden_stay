// Record interested visitor / lead for the current page.
// Prefer the existing saveLead API (defined in leads.js). If not present,
// fall back to the Storage helper.
(function () {
  try {
    const page = location.pathname || document.location.pathname;
    const timestamp = new Date().toLocaleString();

    if (typeof saveLead === "function") {
      // Some pages call saveLead with a friendly name; pass pathname for clarity.
      saveLead(page);
      return;
    }

    if (typeof Storage !== "undefined" && Storage.push) {
      Storage.push("leads", { page, time: timestamp });
      return;
    }

    // Last-resort: try localStorage directly
    const key = "leads";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ page, time: timestamp });
    localStorage.setItem(key, JSON.stringify(existing));
  } catch (err) {
    // Do not throw — leads are a best-effort metric.
    console.warn("Could not record lead:", err);
  }
})();
