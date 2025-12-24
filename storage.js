const Storage = {
  get(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  push(key, item) {
    const data = this.get(key);
    data.push(item);
    this.set(key, data);
  },

  removeByIndex(key, index) {
    const data = this.get(key);
    data.splice(index, 1);
    this.set(key, data);
  }
};
