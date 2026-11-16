import "./env.js";
import jwt from "jsonwebtoken";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [salt, key] = String(stored || "").split(":");
    if (!salt || !key) return false;
    const derived = await scryptAsync(password, salt, 64);
    const keyBuf = Buffer.from(key, "hex");
    if (derived.length !== keyBuf.length) return false;
    return timingSafeEqual(derived, keyBuf);
  } catch {
    return false;
  }
}

export function signAdmin(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function readAdmin(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = Number(payload.sub);
    if (!id) return null;
    return { id, email: payload.email };
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const admin = readAdmin(req);
  if (!admin) return res.status(401).json({ error: "Sign in required" });
  req.admin = admin;
  next();
}
