import jwt from 'jsonwebtoken';

export function signAdminToken(adminId) {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
