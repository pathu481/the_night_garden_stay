const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let bookings = [];

// Create booking
app.post("/api/bookings", (req, res) => {
  const b = req.body;
  const newBooking = {
    id: Date.now().toString(),
    ...b,
    status: b.status || "pending",
    time: new Date().toLocaleString()
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Update booking status
app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  bookings[idx].status = status;
  res.json(bookings[idx]);
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  bookings = bookings.filter(b => b.id !== id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
