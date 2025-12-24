function exportCSV(key) {
  let data = [];
  try {
    if (typeof Storage !== 'undefined' && Storage.get) data = Storage.get(key) || [];
    else data = JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    data = JSON.parse(localStorage.getItem(key)) || [];
  }

  if (!data || !data.length) return alert("No data");

  const csv =
    Object.keys(data[0]).join(",") + "\n" +
    data.map(row => Object.values(row).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = `${key}.csv`;
  a.click();
}
