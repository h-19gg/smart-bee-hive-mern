import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req,res)=>{
  try{
    const { username, email, password } = req.body;
    if(!username||!email||!password) return res.status(400).json({error:'Missing fields'});
    const exists = await User.findOne({ $or:[{username},{email}] });
    if(exists) return res.status(409).json({error:'Username or email already taken'});
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    return res.json({ id:user._id, username:user.username, email:user.email });
  }catch(e){ res.status(500).json({error:e.message}); }
});

router.post('/login', async (req,res)=>{
  try{
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) return res.status(401).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({error:'Invalid credentials'});
    const token = jwt.sign({ userId:user._id, username:user.username }, process.env.JWT_SECRET || 'dev_secret', {expiresIn:'7d'});
    return res.json({ token, user: { id:user._id, username:user.username, email:user.email } });
  }catch(e){ res.status(500).json({error:e.message}); }
});

export default router;
