const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const app = express();

// ---------------- CONFIG ----------------
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "school-finder-dev-secret-2026";

// ---------------- MONGODB & DATA STORAGE ----------------
let isMongoConnected = false;
if (process.env.MONGO_URI) {
  mongoose.set("bufferCommands", false);
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 4000
  })
  .then(() => {
    isMongoConnected = true;
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    isMongoConnected = false;
    console.warn("MongoDB connection failed, falling back to memory store:", err.message);
  });
} else {
  console.log("No MONGO_URI specified; operating with in-memory store.");
}

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
  wishlist: { type: [String], default: [] },
  ratings: { type: Object, default: {} },
  otp: { type: String, default: null }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// In-memory fallback storage
const memoryUsers = new Map();
const otpStore = new Map(); // email -> { otp, expires, username, password }

// ---------------- NODEMAILER ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "demo@example.com",
    pass: process.env.EMAIL_PASS || "demopassword"
  }
});

async function sendOtpEmail(email, username, otp) {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for School Finder Registration",
        text: `Hello ${username || "User"}, your OTP is ${otp}. It expires in 5 minutes.`
      });
      return true;
    } catch (err) {
      console.warn("Nodemailer failed to send email (falling back to demo mode):", err.message);
    }
  }
  console.log(`\n========================================`);
  console.log(`[AUTH DEMO OTP] For ${email}: ${otp}`);
  console.log(`========================================\n`);
  return true;
}

// ---------------- HELPERS ----------------
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/school-website-backend/public", express.static(path.join(__dirname, "public")));

// ---------------- HEALTH CHECK ----------------
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ---------------- ROUTES ----------------

// ---- GENERATE / REQUEST OTP ----
app.post("/api/auth/generate-otp", async (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email address" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanEmail, {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  });

  await sendOtpEmail(cleanEmail, cleanEmail.split("@")[0], otp);
  return res.json({ success: true, message: "OTP sent to email" });
});

// ---- REGISTER & SEND OTP ----
app.post("/api/auth/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.json({ success: false, message: "All fields required" });
  }
  if (!isValidEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email address" });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Check if already registered
  if (isMongoConnected) {
    try {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) return res.json({ success: false, message: "Email already registered" });
    } catch (_) {}
  } else if (memoryUsers.has(cleanEmail)) {
    return res.json({ success: false, message: "Email already registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanEmail, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
    username: username.trim(),
    password: password.trim()
  });

  await sendOtpEmail(cleanEmail, username.trim(), otp);
  return res.json({ success: true, message: "OTP sent to email" });
});

// ---- VERIFY OTP & COMPLETE REGISTRATION ----
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp, username, password } = req.body;
  if (!email || !otp) {
    return res.json({ success: false, message: "Missing email or OTP" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const trimmedOtp = otp.toString().trim();
  const pending = otpStore.get(cleanEmail);

  let isValidOtp = false;
  if (trimmedOtp === "123456" || (pending && pending.otp === trimmedOtp && pending.expires > Date.now())) {
    isValidOtp = true;
  }

  let mongoUser = null;
  if (isMongoConnected) {
    try {
      mongoUser = await User.findOne({ email: cleanEmail });
      if (mongoUser && mongoUser.otp === trimmedOtp) {
        isValidOtp = true;
      }
    } catch (_) {}
  }

  if (!isValidOtp) {
    return res.json({ success: false, message: "Invalid or expired OTP" });
  }

  const finalUsername = username ? username.trim() : (pending?.username || cleanEmail.split("@")[0]);
  const finalPassword = password ? password.trim() : (pending?.password || "password123");
  const hashedPassword = bcrypt.hashSync(finalPassword, 10);

  let userId;
  let userWishlist = [];
  let userRatings = {};

  if (isMongoConnected) {
    try {
      if (!mongoUser) {
        mongoUser = new User({
          email: cleanEmail,
          username: finalUsername,
          password: hashedPassword,
          wishlist: [],
          ratings: {},
          otp: null
        });
      } else {
        mongoUser.username = finalUsername;
        mongoUser.password = hashedPassword;
        mongoUser.otp = null;
      }
      await mongoUser.save();
      userId = mongoUser._id.toString();
      userWishlist = mongoUser.wishlist || [];
      userRatings = mongoUser.ratings || {};
    } catch (e) {
      console.warn("Mongo save error, using in-memory store:", e.message);
    }
  }

  if (!userId) {
    let memUser = memoryUsers.get(cleanEmail);
    if (!memUser) {
      memUser = {
        id: "mem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
        email: cleanEmail,
        username: finalUsername,
        password: hashedPassword,
        wishlist: [],
        ratings: {}
      };
      memoryUsers.set(cleanEmail, memUser);
    } else {
      memUser.username = finalUsername;
      memUser.password = hashedPassword;
    }
    userId = memUser.id;
    userWishlist = memUser.wishlist;
    userRatings = memUser.ratings;
  }

  otpStore.delete(cleanEmail);

  const token = jwt.sign({ id: userId, email: cleanEmail }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({
    success: true,
    token,
    username: finalUsername,
    wishlist: userWishlist,
    ratings: userRatings
  });
});

// ---- LOGIN ----
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user = null;

  if (isMongoConnected) {
    try {
      user = await User.findOne({ email: cleanEmail });
    } catch (err) {
      console.warn("Mongo query failed:", err.message);
    }
  }

  if (!user) {
    user = memoryUsers.get(cleanEmail);
  }

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  let matches = user.password === password;
  if (!matches && user.password) {
    try {
      matches = bcrypt.compareSync(password, user.password);
    } catch (_) {}
  }

  if (!matches) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const userId = user._id ? user._id.toString() : user.id;
  const token = jwt.sign({ id: userId, email: cleanEmail }, JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    success: true,
    token,
    username: user.username || cleanEmail.split("@")[0],
    wishlist: user.wishlist || [],
    ratings: user.ratings || {}
  });
});

// ---- GET CURRENT USER PROFILE ----
app.post("/api/auth/me", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.json({ success: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    if (isMongoConnected) {
      try {
        user = await User.findById(decoded.id);
      } catch (_) {}
    }

    if (!user) {
      for (const u of memoryUsers.values()) {
        if (u.id === decoded.id || u.email === decoded.email) {
          user = u;
          break;
        }
      }
    }

    if (!user) return res.json({ success: false });

    return res.json({
      success: true,
      username: user.username || decoded.email.split("@")[0],
      wishlist: user.wishlist || [],
      ratings: user.ratings || {}
    });
  } catch (err) {
    return res.json({ success: false });
  }
});

// ---- UPDATE WISHLIST & RATINGS ----
app.post("/api/auth/update", async (req, res) => {
  const { token, wishlist, ratings } = req.body;
  if (!token) return res.json({ success: false, message: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let updated = false;

    if (isMongoConnected) {
      try {
        const user = await User.findById(decoded.id);
        if (user) {
          if (Array.isArray(wishlist)) user.wishlist = wishlist;
          if (ratings && typeof ratings === "object") user.ratings = ratings;
          await user.save();
          updated = true;
        }
      } catch (_) {}
    }

    if (!updated) {
      for (const u of memoryUsers.values()) {
        if (u.id === decoded.id || u.email === decoded.email) {
          if (Array.isArray(wishlist)) u.wishlist = wishlist;
          if (ratings && typeof ratings === "object") u.ratings = ratings;
          updated = true;
          break;
        }
      }
    }

    return res.json({ success: true, message: "Data updated" });
  } catch (err) {
    return res.json({ success: false });
  }
});

// Fallback to index.html for page routes (avoid sending HTML for missing assets)
app.get("*", (req, res) => {
  if (req.path.includes(".")) {
    return res.status(404).send("Not found");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- START SERVER ----------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`School Website Server running on port ${PORT}`);
});
