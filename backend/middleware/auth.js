import jwt from 'jsonwebtoken';
export default function auth(req,res,next){
  const header = req.headers['authorization'];
  if(!header) return res.status(401).json({error:'Missing Authorization header'});
  const [type, token] = header.split(' ');
  if(type!=='Bearer' || !token) return res.status(401).json({error:'Invalid Authorization'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  }catch(e){ return res.status(401).json({error:'Invalid or expired token'}); }
}
