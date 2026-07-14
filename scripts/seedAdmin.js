import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase, closeDatabase } from '../config/database.js';
import Admin from '../models/Admin.js';

dotenv.config();

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
  }

  await connectDatabase();

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin account ready: ${admin.username}`);
  await closeDatabase();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  });
