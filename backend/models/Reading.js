import mongoose from 'mongoose';
const readingSchema = new mongoose.Schema({
  hiveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },
  temperature: Number,
  humidity: Number,
  soundLevel: Number,
  weight: Number,
}, { timestamps: true });
export default mongoose.model('Reading', readingSchema);
