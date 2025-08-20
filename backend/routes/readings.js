import express from 'express';
import Reading from '../models/Reading.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, async (req,res)=>{
  const { hiveId, temperature, humidity, soundLevel, weight } = req.body;
  if(!hiveId) return res.status(400).json({error:'hiveId required'});
  const reading = await Reading.create({ hiveId, temperature, humidity, soundLevel, weight });
  res.json(reading);
});
router.get('/:hiveId/latest', auth, async (req,res)=>{
  const { hiveId } = req.params;
  const reading = await Reading.findOne({ hiveId }).sort({ createdAt:-1 });
  res.json(reading||null);
});
export default router;
