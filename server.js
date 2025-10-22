import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Comment from './models/comment.js';
import crypto from 'crypto';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 4000;
const SECRET = process.env.HMAC_SECRET || 'default_secret';

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/comments', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') return res.status(400).json({ error: 'Empty comment' });
  const deleteToken = crypto.randomBytes(16).toString('hex');
  const hmac = crypto.createHmac('sha256', SECRET).update(deleteToken).digest('hex');
  const comment = new Comment({ text, deleteHash: hmac });
  await comment.save();
  res.json({ message: 'Comment added', deleteToken });
});

app.get('/api/comments', async (_, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

app.delete('/api/comments/:token', async (req, res) => {
  const token = req.params.token;
  const hmac = crypto.createHmac('sha256', SECRET).update(token).digest('hex');
  const deleted = await Comment.findOneAndDelete({ deleteHash: hmac });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
