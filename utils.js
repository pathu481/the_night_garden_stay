const Utils = {
  formatDate(dateStr) {
    return new Date(dateStr).toDateString();
  },

  today() {
    return new Date().toISOString().split("T")[0];
  },

  unique(array) {
    return [...new Set(array)];
  }
};
