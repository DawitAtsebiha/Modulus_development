import express from "express";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "./db.js"; // renamed for clarity
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5501", "http://localhost:5501"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());

const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 10,
});

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 2, // 20 sign-ups per IP
});

app.post("/api/signup", signupLimiter, async (req, res) => {
  const {
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

  const sql = `
    INSERT INTO public.users
           (first_name, last_name, email, password_hashed,
            date_of_birth, school_status, uni_affiliation)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING user_id AS id, first_name, last_name, email, creation_date;
  `;

  try {
    const {
      rows: [user],
    } = await pool.query(sql, [
      firstName,
      lastName,
      email.toLowerCase(),
      pwHash, //password
      dateOfBirth,
      schoolStatus,
      uniAffiliation || "None",
    ]);
    return res.status(201).json(user);
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
  const {
    email,
    password
  } = req.body;

  // basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    // 1. pull the user
    const {
      rows: [u],
    } = await pool.query(
      `SELECT user_id, first_name, last_name, email, password_hashed
         FROM public.users
        WHERE email = $1`,
      [email.toLowerCase()]
    );
    if (!u) return res.status(401).json({ error: "Invalid credentials" });

    // 2. check password
    const ok = await bcrypt.compare(password, u.password_hashed);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // 3. success → issue token (or session)
    const token = jwt.sign({ id: u.user_id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.json({
      id: u.user_id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      token,                           // move to cookie if preferred
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// default 3000 if PORT not set
app.listen(3000);
console.log("API listening…");
