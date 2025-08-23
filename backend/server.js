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

// إصلاح CORS - تحويل إلى مصفوفة إذا كان هناك قيم متعددة
const CORS_ORIGIN = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : '*';

app.use(cors({ 
  origin: CORS_ORIGIN,
  credentials: true
}));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartbeehive';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e => { 
    console.error('❌ Mongo error', e.message); 
    process.exit(1); 
  });

app.get('/', (req, res) => res.json({ status: 'Smart Bee Hive API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/hives', hiveRoutes);
app.use('/api/readings', readingRoutes);

app.listen(PORT, '0.0.0.0', () => 
  console.log(`✅ API Server running on http://0.0.0.0:${PORT}`)
);