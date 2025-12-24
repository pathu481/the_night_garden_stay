const Analytics = {
  bookings() {
    return Storage.get("bookings").length;
  },
  leads() {
    return Storage.get("leads").length;
  },
  reviews() {
    return Storage.get("reviews")
      .filter(r => r.status === "approved").length;
  }
};
