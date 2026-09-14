const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// ---------------- USER SCHEMA ----------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  wishlist: { type: Array, default: [] },
  ratings: { type: Object, default: {} }
});

const User = mongoose.model("User", userSchema);

// ---------------- OTP STORAGE ----------------
const otpStore = {}; // { email: { otp: "123456", expires: timestamp } }

// ---------------- EMAIL CONFIG ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ---------------- REGISTER STEP 1: SEND OTP ----------------
router.post("/register", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;
  if (!email || !username || !password || !confirmPassword) return res.status(400).json({ success:false, message:"All fields required" });
  if (password !== confirmPassword) return res.status(400).json({ success:false, message:"Passwords do not match" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success:false, message:"Email already registered" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send OTP via email
    await transporter.sendMail({
      from: `"School Finder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for registration",
      text: `Hello ${username}, your OTP is ${otp}. It expires in 5 minutes.`
    });

    res.json({ success:true, message:"OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error" });
  }
});

// ---------------- REGISTER STEP 2: VERIFY OTP ----------------
router.post("/verify-otp", async (req,res)=>{
  const { email, username, password, otp } = req.body;
  if(!email || !username || !password || !otp) return res.status(400).json({ success:false, message:"All fields required" });

  const record = otpStore[email];
  if(!record) return res.status(400).json({ success:false, message:"OTP not requested" });
  if(record.expires < Date.now()) return res.status(400).json({ success:false, message:"OTP expired" });
  if(record.otp !== otp) return res.status(400).json({ success:false, message:"Invalid OTP" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    delete otpStore[email];
    res.json({ success:true, message:"Account created successfully" });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error" });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ success:false, message:"All fields required" });

  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ success:false, message:"User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ success:false, message:"Wrong password" });

    const token = jwt.sign({ id:user._id, email:user.email }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ success:true, token, email:user.email, wishlist:user.wishlist, ratings:user.ratings });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error" });
  }
});

// ---------------- UPDATE WISHLIST/RATINGS ----------------
router.post("/update", async (req,res)=>{
  const { token, wishlist, ratings } = req.body;
  if(!token) return res.status(400).json({ success:false, message:"No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user) return res.status(400).json({ success:false, message:"User not found" });

    if(wishlist) user.wishlist = wishlist;
    if(ratings) user.ratings = ratings;

    await user.save();
    res.json({ success:true, message:"Data updated" });
  } catch(err) {
    console.error(err);
    res.status(400).json({ success:false, message:"Server error" });
  }
});

module.exports = router;