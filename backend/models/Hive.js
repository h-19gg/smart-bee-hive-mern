import mongoose from 'mongoose';
const hiveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String },
}, { timestamps: true });
export default mongoose.model('Hive', hiveSchema);
