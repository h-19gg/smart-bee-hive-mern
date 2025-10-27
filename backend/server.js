/***************************************************
 * Smart Bee Hive Backend (Fixed & Ready)
 * Connected to MongoDB Atlas + Render + Vercel
 ***************************************************/
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import hiveRoutes from './routes/hives.js';
import readingRoutes from './routes/readings.js';

dotenv.config();
const app = express();
app.use(express.json());

/* ✅ إعداد CORS للسماح بطلبات من Vercel Frontend */
const CORS_ORIGIN = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',')
  : ['https://smart-bee-hive-mern.vercel.app'];

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));

/* ✅ إعداد اتصال قاعدة البيانات */
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hussein-22:B5ovF4ojJSlRYoIr@cluster0.ywknfhw.mongodb.net/smart-bee-hive?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => { 
    console.error('❌ MongoDB connection error:', e.message);
    process.exit(1);
  });

/* ✅ نقطة فحص عامة */
app.get('/', (req, res) => {
  res.json({ status: 'Smart Bee Hive API running' });
});

/* ✅ نقاط API */
app.use('/api/auth', authRoutes);
app.use('/api/hives', hiveRoutes);
app.use('/api/readings', readingRoutes);

/* ✅ نقطة فحص جاهزية */
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

/* ✅ بدء السيرفر */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Smart Bee Hive API Server running on port ${PORT}`);
});
