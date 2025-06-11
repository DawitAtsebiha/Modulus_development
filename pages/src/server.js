import express from 'express';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import bcrypt  from 'bcryptjs';
import { pool } from './db.js';   // renamed for clarity
import cors    from 'cors';

const app = express();

app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
  ],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,          // keep if you’ll use cookies later
}));

app.use(express.json());

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 5,                   // 20 sign-ups per IP
});

app.post('/api/signup', signupLimiter, async (req, res) => {
  const {
    firstName, lastName, email, password,
    dateOfBirth, schoolStatus, uniAffiliation,
  } = req.body;

  // basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const pwHash = await bcrypt.hash(password, 12);

  const sql = `
    INSERT INTO public.users
           (first_name, last_name, email, password,
            date_of_birth, school_status, uni_affiliation)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING uuid AS id, first_name, last_name, email, created_at;
  `;

  try {
    const { rows: [user] } = await pool.query(sql, [
      firstName,
      lastName,
      email.toLowerCase(),
      password,
      dateOfBirth,
      schoolStatus,
      uniAffiliation || 'None',
    ]);
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === '23505') {               // unique_violation
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Signup failed' });
  }
});

// default 3000 if PORT not set
app.listen(3000);  
console.log('API listening…');
