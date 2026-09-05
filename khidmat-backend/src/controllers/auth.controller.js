const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
require('dotenv').config();

const JWT_EXPIRY = '7d'; // token valid for 7 days

// ---------- SIGNUP ----------
async function signup(req, res) {
  try {
    const { name, email, password, role, phone } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }

    const allowedRoles = ['donor', 'volunteer', 'admin'];
    const finalRole = allowedRoles.includes(role) ? role : 'donor'; // default to donor if not given/invalid

    // Check if user already exists
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      console.error(lookupError);
      return res.status(500).json({ error: 'Error checking existing user' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    // Hash password before storing
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password_hash, role: finalRole, phone }])
      .select('id, name, email, role, phone, created_at')
      .single();

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({ error: 'Error creating user' });
    }

    // Issue JWT immediately so the client is logged in right after signup
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- LOGIN ----------
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role, phone')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error looking up user' });
    }

    // Same generic error whether email doesn't exist or password is wrong,
    // so we don't leak which emails are registered
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Never send password_hash back to the client
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- GET CURRENT USER (uses token from auth middleware) ----------
async function getMe(req, res) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

module.exports = { signup, login, getMe };