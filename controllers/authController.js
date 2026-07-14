import Admin from '../models/Admin.js';
import { signAdminToken } from '../utils/jwt.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signAdminToken(admin._id.toString());
    res.cookie('admin_token', token, COOKIE_OPTIONS);
    res.json({ success: true, username: admin.username });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.clearCookie('admin_token', { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true });
}

export async function me(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.adminId).select('username');
    if (!admin) return res.status(401).json({ error: 'Unauthorized' });
    res.json({ username: admin.username });
  } catch (error) {
    next(error);
  }
}
