function saveLead(pageName) {
  let leads = JSON.parse(localStorage.getItem("leads")) || [];

  const lead = {
    page: pageName,
    time: new Date().toLocaleString(),
    device: navigator.userAgent,
  };

  leads.push(lead);
  localStorage.setItem("leads", JSON.stringify(leads));
}
