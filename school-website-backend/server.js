require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

// ---------------- MONGODB ----------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend files

// ---------------- SCHEMAS ----------------
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  wishlist: { type: [String], default: [] },
  ratings: { type: Object, default: {} },
  otp: String
});
const User = mongoose.model("User", userSchema);

// ---------------- NODEMAILER ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---------------- HELPERS ----------------
function isValidEmail(email) {
  // only accept valid Gmail addresses
  const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return re.test(email);
}

// ---------------- ROUTES ----------------

// ---- REGISTER & SEND OTP ----
app.post("/api/auth/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.json({ success: false, message: "All fields required" });

  // check for valid Gmail address
  if (!isValidEmail(email)) return res.json({ success: false, message: "Please enter a valid Gmail address" });

  const existing = await User.findOne({ email });
  if (existing) return res.json({ success: false, message: "Email already registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for School Finder Registration",
      text: `Hello ${username}, your OTP is ${otp}`
    });

    const newUser = new User({ email, username, password, otp });
    await newUser.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Failed to send OTP" });
  }
});

// ---- VERIFY OTP ----
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.json({ success: false, message: "Missing fields" });

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "User not found" });

  if (user.otp === otp) {
    user.otp = null; // clear OTP
    await user.save();
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "OTP mismatch" });
  }
});

// ---- LOGIN ----
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token, wishlist: user.wishlist, ratings: user.ratings, username: user.username });
});

// ---- GET CURRENT USER ----
app.post("/api/auth/me", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ success: false });
    res.json({ success: true, wishlist: user.wishlist, ratings: user.ratings, username: user.username });
  } catch (err) {
    res.json({ success: false });
  }
});

// ---- UPDATE WISHLIST & RATINGS ----
app.post("/api/auth/update", async (req, res) => {
  const { token, wishlist, ratings } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ success: false });

    user.wishlist = wishlist;
    user.ratings = ratings;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5502;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));