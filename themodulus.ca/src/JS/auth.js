import { pool } from "./database.js";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  try {
    // a) try header:  Authorization: Bearer <token>
    let token = null;
    const hdr = req.get("Authorization");
    if (hdr?.startsWith("Bearer ")) token = hdr.slice(7).trim();

    // b) fallback to cookie named "auth" (optional)
    if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ error: "No token" });

    // c) decode
    const payload = jwt.verify(token, process.env.JWT_SECRET); // → { id: … }

    // d) fetch the fresh user record (cheap SELECT, no password column)
    const {
      rows: [user],
    } = await pool.query(
      `SELECT user_id, first_name, last_name, email, creation_date
         FROM public.users
        WHERE user_id = $1`,
      [payload.id]
    );
    if (!user) return res.status(401).json({ error: "User not found" });

    req.currentUser = { id: payload.id };               // stash for later routes
    next();                               // continue
  } catch (err) {
    console.error("authMiddleware:", err.message);
    return res.status(401).json({ error: "Invalid/expired token" });
  }
}