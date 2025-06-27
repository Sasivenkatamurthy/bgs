import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { account, storage, ID } from './appwrite.js'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// MongoDB setup
let mongoConnected = false;
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
const imageSchema = new mongoose.Schema({
  email: String,
  fileId: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema, 'users');
const Image = mongoose.model('Image', imageSchema, 'images');

mongoose.connect(
  process.env.MONGODB_URI
)
  .then(() => {
    mongoConnected = true;
    console.log('MongoDB connected');
  })
  .catch(err => {
    mongoConnected = false;
    console.error('MongoDB connection error:', err);
  });

// Register user
app.post('/api/save-user', async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }
    res.json({ status: 'success', message: 'User saved', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Could not save user' });
  }
});

// Send OTP using Appwrite
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const token = await account.createEmailToken(ID.unique(), email, true);
    res.json({ status: 'success', message: 'OTP sent to your email', userId: token.userId, phrase: token.phrase });
  } catch (err) {
    console.error('Appwrite send-otp error:', err); 
    res.status(500).json({ status: 'error', message: 'Could not send OTP', error: err.message });
  }
});

// Verify OTP using Appwrite
app.post('/api/verify-otp', async (req, res) => {
  const { name, email, otp, userId } = req.body;
  try {
    await account.createSession(userId, otp);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }
    res.json({ status: 'success', message: 'OTP verified', user });
  } catch (err) {
    res.json({ status: 'error', message: 'Invalid OTP', error: err.message });
  }
});

// List all images in Appwrite Storage bucket
app.get('/api/user-images', async (req, res) => {
  try {
    const files = await storage.listFiles(process.env.APPWRITE_BUCKET); 
    // Manually construct the public view URL for each file
    const images = files.files.map(file =>
      `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT}`
    );
    res.json({ images });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Could not fetch images', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});