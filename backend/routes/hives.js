import express from 'express';
import Hive from '../models/Hive.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', auth, async (req,res)=>{
  const hives = await Hive.find({ userId: req.user.userId }).sort({ createdAt:-1 });
  res.json(hives);
});
router.post('/', auth, async (req,res)=>{
  const { name, location } = req.body;
  if(!name) return res.status(400).json({error:'name required'});
  const hive = await Hive.create({ userId:req.user.userId, name, location });
  res.json(hive);
});
export default router;
