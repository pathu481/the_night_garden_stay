// payment-server-example.js
// Example Express server showing:
//  - /api/upload-aadhaar (file upload via multer)
//  - /api/create-order (creates a Razorpay order)
//  - /api/verify-payment (verifies Razorpay payment signature)
//
// THIS IS AN EXAMPLE. Do NOT store Aadhaar images without proper security and legal compliance.
// Replace placeholders with real credentials and secure storage (S3 with encryption, restricted ACLs, etc.).

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
app.use(express.json());
// Enable CORS for dev/testing (allow requests from your static server / live-server)
app.use(cors());

// configure multer to save uploads to ./uploads (for demo only)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Serve uploaded files (demo only). In production use secure storage and restricted access.
app.use('/uploads', express.static(uploadDir));

// Razorpay client
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_xxx';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_secret';
const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

// In-memory store of orders/bookings for demo (use a real DB in production)
const BOOKINGS_DB = [];

// Upload Aadhaar
// Accept uploads at /api/upload-aadhaar
app.post('/api/upload-aadhaar', upload.single('aadhaar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // In production save to secure storage and return a file id or URL
  const fileId = path.basename(req.file.path);
  return res.json({ fileId, url: `/uploads/${fileId}` });
});

// Upload generic proof (screenshot of UPI payment, etc.)
app.post('/api/upload-proof', upload.single('proof'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No proof uploaded' });
    const fileId = path.basename(req.file.path);
    return res.json({ fileId, url: `/uploads/${fileId}` });
  } catch (err) {
    console.error('upload-proof error', err);
    return res.status(500).json({ error: 'upload_failed' });
  }
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, booking, aadhaarId } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount required' });

    const options = {
      amount: amount, // in paise
      currency: currency || 'INR',
      receipt: `order_rcptid_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);

    // store booking snapshot with order id
    BOOKINGS_DB.push({ orderId: order.id, booking, aadhaarId, status: 'created', createdAt: new Date() });

    return res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to create order' });
  }
});

// Verify payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { payment, booking, aadhaarId } = req.body; // payment contains razorpay_payment_id, razorpay_order_id, razorpay_signature
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = payment;
    const generated_signature = require('crypto')
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // mark booking as confirmed in DB (demo)
      const rec = BOOKINGS_DB.find(b => b.orderId === razorpay_order_id);
      if (rec) rec.status = 'paid';
      // In production, record the booking in your DB and trigger notifications (email/WhatsApp)
      return res.json({ success: true });
    }

    return res.status(400).json({ success: false, error: 'signature_mismatch' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'verification_failed' });
  }
});

// Record UPI payment (simple demo endpoint)
app.post('/api/record-upi', (req, res) => {
  try {
    // Accept additional fields: proofUrl (uploaded proof image URL), txnId (transaction reference), bookingId (optional link to a booking)
    const { aadhaarId, amount, method, vpa, note, time, meta, proofUrl, txnId, bookingId } = req.body;
    const rec = {
      id: `pay_${Date.now()}`,
      orderId: `upi_${Date.now()}`,
      bookingId: bookingId || null,
      aadhaarId: aadhaarId || null,
      amount: amount || null,
      currency: 'INR',
      method: method || 'UPI',
      vpa: vpa || null,
      txnId: txnId || null,
      proofUrl: proofUrl || null,
      note: note || null,
      meta: meta || null,
      status: 'paid',
      createdAt: new Date()
    };
    BOOKINGS_DB.push(rec);
    return res.json({ success: true, record: rec });
  } catch (err) {
    console.error('record-upi error', err);
    return res.status(500).json({ success: false, error: 'record_failed' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Payment mock server listening on', port));

// Note: For production:
// - Do NOT store Aadhaar images on local disk. Use encrypted S3 buckets or secure storage with strict access control.
// - Ensure you comply with local Aadhaar data storage/processing rules (UIDAI) and privacy laws.
// - Use HTTPS, authentication, CSRF protections and validate inputs.