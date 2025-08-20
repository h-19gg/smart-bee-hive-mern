import React, { useEffect, useState } from 'react';
import { api } from './api.js';

const card = {background:'#111827', padding:'1rem', borderRadius:12, boxShadow:'0 6px 20px rgba(0,0,0,0.25)', border:'1px solid #1f2937'};

function Auth({ onAuthed }){
  const [mode,setMode] = useState('login');
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');

  const submit = async (e)=>{
    e.preventDefault(); setError('');
    try{
      if(mode==='signup'){
        await api('/api/auth/register','POST',{ username, email, password });
        alert('✅ تم إنشاء الحساب! الرجاء تسجيل الدخول الآن.'); setMode('login'); return;
      } else {
        const data = await api('/api/auth/login','POST',{ username, password });
        onAuthed(data);
      }
    }catch(err){ setError(err.message); }
  };

  return (
    <div style={{maxWidth:440, margin:'5rem auto', ...card}}>
      <img src="/logo.svg" alt="Eng.Husein Al-Khazaali" style={{height:60, display:'block', margin:'0 auto 12px'}}/>
      <h2 style={{textAlign:'center', margin:4}}>Smart Bee Hive</h2>
      <p style={{textAlign:'center', color:'#9ca3af', marginTop:0}}>Eng.Husein Al-Khazaali</p>
      <div style={{display:'flex', gap:8, justifyContent:'center', marginBottom:12}}>
        <button onClick={()=>setMode('login')} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #374151', background: mode==='login'?'#f59e0b':'#111827', color:'#fff'}}>تسجيل الدخول</button>
        <button onClick={()=>setMode('signup')} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #374151', background: mode==='signup'?'#f59e0b':'#111827', color:'#fff'}}>إنشاء حساب</button>
      </div>
      <form onSubmit={submit} style={{display:'grid', gap:8}}>
        <input placeholder="اسم المستخدم" value={username} onChange={e=>setUsername(e.target.value)} required/>
        {mode==='signup' && <input placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} required/>}
        <input placeholder="كلمة المرور" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button style={{padding:'10px', border:'none', borderRadius:8, background:'#10b981', color:'#fff', fontWeight:'bold'}}>{mode==='signup'?'إنشاء حساب':'تسجيل الدخول'}</button>
      </form>
      {error && <p style={{color:'#f87171', marginTop:8, textAlign:'center'}}>{error}</p>}
    </div>
  );
}

function Dashboard({ token, user, onLogout }){
  const [hives,setHives] = useState([]);
  const [newHive,setNewHive] = useState({ name:'', location:'' });
  const [latest,setLatest] = useState(null);
  const [selected,setSelected] = useState(null);
  const [error,setError] = useState('');

  const fetchHives = async ()=>{
    try{
      const data = await api('/api/hives','GET',null,token);
      setHives(data);
      if(!selected && data.length>0) setSelected(data[0]._id);
    }catch(err){ setError(err.message); }
  };
  const fetchLatest = async ()=>{
    if(!selected) return;
    try{
      const data = await api(`/api/readings/${selected}/latest`,'GET',null,token);
      setLatest(data);
    }catch(err){ setError(err.message); }
  };
  const addHive = async (e)=>{
    e.preventDefault();
    try{
      await api('/api/hives','POST', newHive, token);
      setNewHive({name:'',location:''});
      fetchHives();
    }catch(err){ setError(err.message); }
  };
  const addDemoReading = async ()=>{
    if(!selected) return;
    const body = {
      hiveId: selected,
      temperature: +(20+Math.random()*10).toFixed(1),
      humidity: +(50+Math.random()*20).toFixed(0),
      soundLevel: +(30+Math.random()*30).toFixed(0),
      weight: +(10+Math.random()*5).toFixed(1)
    };
    try{ await api('/api/readings','POST', body, token); fetchLatest(); }catch(err){ setError(err.message); }
  };

  useEffect(()=>{ fetchHives(); },[]);
  useEffect(()=>{ fetchLatest(); },[selected]);

  return (
    <div style={{maxWidth:1024, margin:'1rem auto', padding:'1rem'}}>
      <header style={{background:'#0f172a', padding:'1rem', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid #1f2937'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src="/logo.svg" alt="logo" style={{height:48}}/>
          <div><h2 style={{margin:0}}>Smart Bee Hive</h2><small style={{color:'#9ca3af'}}>Eng.Husein Al-Khazaali</small></div>
        </div>
        <div><span style={{marginInlineEnd:12}}>👤 {user.username}</span><button onClick={onLogout} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #374151', background:'#111827', color:'#fff'}}>تسجيل الخروج</button></div>
      </header>

      <section style={{marginTop:16, ...card}}>
        <h3>خلاياك</h3>
        <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:8}}>
          {hives.map(h=> (
            <div key={h._id} onClick={()=>setSelected(h._id)} style={{cursor:'pointer', padding:'0.75rem 1rem', borderRadius:10, border: selected===h._id?'2px solid #10b981':'1px solid #374151', background:selected===h._id?'#0b1220':'#0b1220'}}>
              <b>{h.name}</b><br/><small style={{color:'#9ca3af'}}>{h.location||'—'}</small>
            </div>
          ))}
        </div>
        <form onSubmit={addHive} style={{display:'flex', gap:8, marginTop:12}}>
          <input placeholder="اسم الخلية" value={newHive.name} onChange={e=>setNewHive({...newHive, name:e.target.value})} required/>
          <input placeholder="الموقع" value={newHive.location} onChange={e=>setNewHive({...newHive, location:e.target.value})}/>
          <button style={{padding:'8px 12px', border:'none', borderRadius:8, background:'#10b981', color:'#fff'}}>➕ إضافة خلية</button>
        </form>
      </section>

      <section style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12}}>
        <div style={{...card}}><h4>درجة الحرارة</h4><p style={{fontSize:24, margin:0}}>{latest?.temperature ?? '--'} °C</p></div>
        <div style={{...card}}><h4>الرطوبة</h4><p style={{fontSize:24, margin:0}}>{latest?.humidity ?? '--'} %</p></div>
        <div style={{...card}}><h4>الصوت</h4><p style={{fontSize:24, margin:0}}>{latest?.soundLevel ?? '--'} dB</p></div>
        <div style={{...card}}><h4>وزن الخلية</h4><p style={{fontSize:24, margin:0}}>{latest?.weight ?? '--'} kg</p></div>
      </section>

      <section style={{marginTop:16, ...card}}>
        <h3>إضافة قراءة تجريبية</h3>
        <button onClick={addDemoReading} disabled={!selected} style={{padding:'8px 12px', border:'none', borderRadius:8, background:'#f59e0b', color:'#1f2937'}}>Add Random Reading</button>
        {error && <p style={{color:'#f87171', marginTop:8}}>{error}</p>}
      </section>
    </div>
  );
}

export default function App(){
  const [session,setSession] = useState(()=>{
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  });
  if(!session){
    return <Auth onAuthed={({token, user})=>{ localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); setSession({token, user}); }} />
  }
  return <Dashboard token={session.token} user={session.user} onLogout={()=>{localStorage.clear(); setSession(null);}} />
}
