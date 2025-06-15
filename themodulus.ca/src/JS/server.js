import express from "express";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "./database.js"; // renamed for clarity
import cors from "cors";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./auth.js"
import cookieParser from "cookie-parser";
import { sendVerificationCode } from "./mailer.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:5501",
      "http://localhost:5501",
    ],
    methods: ["GET", "POST"],            
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());      

app.use(express.json());

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 2, // 20 sign-ups per IP
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


app.post("/api/verify-email", async (req, res) => {
  const { email, code } = req.body;

  const query = `
    SELECT user_id, verification_code, verification_expires_at
    FROM users
    WHERE email = $1;
  `;

  const update = `
    UPDATE users
    SET email_verified = TRUE, verification_code = NULL, verification_expires_at = NULL
    WHERE email = $1;
  `;

  try {
    const { rows: [user] } = await pool.query(query, [email]);

    if (!user || user.verification_code !== code) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    if (new Date(user.verification_expires_at) < new Date()) {
      return res.status(400).json({ error: "Verification code expired." });
    }

    await pool.query(update, [email]);

    // 3. Success → issue JWT and set cookie
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",                           // CSRF protection
        secure: true,
        maxAge: 2 * 60 * 60 * 1000,               // 2 hours
      });
    
    return res.status(200).json({ message: "Email verified successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed." });
  }
});


app.post("/api/signup", signupLimiter, async (req, res) => {
  const {
    user_id,
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    schoolStatus,
    uniAffiliation,
  } = req.body;

  // basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
  }

  const pwHash = await bcrypt.hash(password, 12);

  const verificationCode = generateCode();
  const codeExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const sql = `
    INSERT INTO public.users
           (first_name, last_name, email, password_hashed,
            verification_code, verification_expires_at,
            date_of_birth, school_status, uni_affiliation)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING user_id, first_name, last_name, email, creation_date;
  `;
  
  try {
    const {
      rows: [user],
    } = await pool.query(sql, [
      firstName,
      lastName,
      email.toLowerCase(),
      pwHash, //password
      verificationCode,
      codeExpiry,
      dateOfBirth,
      schoolStatus,
      uniAffiliation || "None",
    ]);

    await sendVerificationCode(email, verificationCode);
    return res.status(200).json({ message: "Verification code has been sent to your email." });

  } catch (err) {
    if (err.code === "23505") {
      // unique_violation
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error(err);
    return res.status(500).json({ error: "Signup failed" });
  }
});


app.post("/api/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    // 1. Pull the user
    const {
      rows: [u],
    } = await pool.query(
      `SELECT user_id, first_name, last_name, email, password_hashed
         FROM public.users
        WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (!u) return res.status(401).json({ error: "Invalid credentials" });

    // 2. Check password
    const ok = await bcrypt.compare(password, u.password_hashed);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // 3. Check if email is verified
    if (!u.email_verified) {
      return res.status(403).json({ error: "Please verify your email first." });
    }

    // 4. Success → issue JWT and set cookie
    const token = jwt.sign({ id: u.user_id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",                           // CSRF protection
        secure: true, // HTTPS in prod
        maxAge: 2 * 60 * 60 * 1000,               // 2 hours
      })
      .status(200)
      .json({
        id: u.user_id,
        firstName: u.first_name,
        dateOfBirth: u.dateOfBirth,
        lastName: u.last_name,
        email: u.email,
        schoolStatus: u.schoolStatus,
        uniAffiliation: u.uniAffiliation
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});



app.get("/api/me", authMiddleware, async (req, res) => {
  const { id } = req.currentUser;           // you put "id" in the JWT

  const sql = `
    SELECT user_id          AS id,
           first_name       AS "firstName",
           last_name        AS "lastName",
           email,
           date_of_birth    AS "dateOfBirth",
           creation_date    AS "creationDate",
           school_status    AS "schoolStatus",
           uni_affiliation  AS "uniAffiliation"
      FROM public.users
     WHERE user_id = $1
  `;
  try {
    const { rows:[user] } = await pool.query(sql, [id]);
    if (!user) return res.status(404).json({ error:"User not found" });
    res.json(user);                          // <-- sends all columns
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Failed to load profile" });
  }
});

app.get("/api/logout", authMiddleware, async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.json({ message: "Successfully logged out." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed." });
  }
});

// default 3000 if PORT not set
app.listen(3000);
console.log("API listening…");
