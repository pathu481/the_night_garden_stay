const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let bookings = [];

const OWNER_EMAIL = 'thenightgardenstay@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

app.post('/api/book', async (req, res) => {
  const { name, email, phone, checkin, checkout, guests, message } = req.body;
  const booking = { id: Date.now(), name, email, phone, checkin, checkout, guests, message, time: new Date().toLocaleString() };
  bookings.push(booking);

  try {
    await transporter.sendMail({
      from: 'YOUR_EMAIL@gmail.com',
      to: OWNER_EMAIL,
      subject: 'New Booking Request - The Night Garden Stay',
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Check-in: ${checkin}
Check-out: ${checkout}
Guests: ${guests}
Message: ${message}
Submitted: ${booking.time}
      `
    });
    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get('/api/bookings', (req, res) => res.json(bookings));

app.listen(5000, () => console.log('Server running on port 5000'));
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});

app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: 2000 * 100, // ₹2000
      currency: 'INR',
      receipt: 'booking_' + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});
