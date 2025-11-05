// تم التعديل بالكامل ليستخدم Supabase لـ (Login, Register, Sensor Data)
import React, { useEffect, useState } from 'react';
import { getLatestSensorData } from './api.js'; // دالة الحساسات
import { supabase } from './supabaseClient.js'; // عميل Supabase

const card = {background:'#111827', padding:'1rem', borderRadius:12, boxShadow:'0 6px 20px rgba(0,0,0,0.25)', border:'1px solid #1f2937'};

// === 1. دالة المصادقة (Auth) مُعدلة بالكامل ===
function Auth(){
  const [mode,setMode] = useState('login');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e)=>{
    e.preventDefault(); setError(''); setLoading(true);
    try{
      if(mode==='signup'){
        // استخدم Supabase لإنشاء حساب
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('✅ تم إنشاء الحساب! الرجاء التحقق من بريدك الإلكتروني لتفعيل الحساب.');
        setMode('login');
      } else {
        // استخدم Supabase لتسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // (سيتم تحديث الجلسة تلقائياً في دالة App الرئيسية)
      }
    }catch(err){ setError(err.message); }
    finally { setLoading(false); }
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
        {/* Supabase يستخدم "البريد الإلكتروني" بدلاً من "اسم المستخدم" */}
        <input placeholder="البريد الإلكتروني" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input placeholder="كلمة المرور" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button disabled={loading} style={{padding:'10px', border:'none', borderRadius:8, background:'#10b981', color:'#fff', fontWeight:'bold'}}>
          {loading ? '...جاري' : (mode==='signup'?'إنشاء حساب':'تسجيل الدخول')}
        </button>
      </form>
      {error && <p style={{color:'#f87171', marginTop:8, textAlign:'center'}}>{error}</p>}
    </div>
  );
}

// === 2. لوحة التحكم (Dashboard) مُعدلة بالكامل ===
function Dashboard({ user }){
  const [latest,setLatest] = useState(null); // بيانات الحساسات
  const [error,setError] = useState('');

  const fetchLatest = async ()=>{
    try{
      const data = await getLatestSensorData(); // جلب بيانات Supabase
      setLatest(data);
    }catch(err){ setError(err.message); }
  };

  // جلب البيانات عند التحميل، وتحديثها كل 30 ثانية
  useEffect(()=>{
    fetchLatest();
    const interval = setInterval(fetchLatest, 30000);
    return () => clearInterval(interval);
  },[]);

  return (
    <div style={{maxWidth:1024, margin:'1rem auto', padding:'1rem'}}>
      <header style={{background:'#0f172a', padding:'1rem', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid #1f2937'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src="/logo.svg" alt="logo" style={{height:48}}/>
          <div><h2 style={{margin:0}}>Smart Bee Hive</h2><small style={{color:'#9ca3af'}}>Eng.Husein Al-Khazaali</small></div>
        </div>
        <div>
          {/* عرض البريد الإلكتروني للمستخدم */}
          <span style={{marginInlineEnd:12}}>👤 {user.email}</span>
          <button onClick={() => supabase.auth.signOut()} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #374151', background:'#111827', color:'#fff'}}>
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* حذفنا قسم "إضافة خلية" لأنه كان يعتمد على MongoDB */}

      <section style={{marginTop:16, ...card}}>
        <h3>البيانات الحية (من ESP32 / Supabase)</h3>
        <div style={{marginTop:16, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12}}>
          <div style={{...card}}><h4>درجة الحرارة</h4><p style={{fontSize:24, margin:0}}>{latest?.temperature ? latest.temperature.toFixed(1) : '--'} °C</p></div>
          <div style={{...card}}><h4>الرطوبة</h4><p style={{fontSize:24, margin:0}}>{latest?.humidity ? latest.humidity.toFixed(1) : '--'} %</p></div>
          <div style={{...card}}><h4>الفولتية (Voltage)</h4><p style={{fontSize:24, margin:0}}>{latest?.voltage ? latest.voltage.toFixed(2) : '--'} V</p></div>
          <div style={{...card}}><h4>وزن الخلية</h4><p style={{fontSize:24, margin:0}}>{latest?.weight ? latest.weight.toFixed(2) : '--'} kg</p></div>
        </div>
        {latest?.created_at && (
          <p style={{textAlign:'center', color:'#9ca3af', marginTop:12, fontSize:'0.9rem'}}>
             آخر تحديث من ESP32: {new Date(latest.created_at).toLocaleString()}
          </p>
        )}
      </section>
      
      {/* حذفنا قسم "إضافة قراءة تجريبية" لأنه كان يعتمد على MongoDB */}
    </div>
  );
}

// === 3. دالة App الرئيسية مُعدلة بالكامل ===
export default function App(){
  const [session,setSession] = useState(null);

  useEffect(() => {
    // جلب الجلسة عند تحميل الصفحة
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // الاستماع لتغييرات الجلسة (تسجيل الدخول / الخروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe(); // التنظيف عند إغلاق الصفحة
  }, []);

  // إذا لم يكن هناك جلسة (لم يسجل دخول)، اعرض صفحة المصادقة
  if(!session){
    return <Auth />
  }
  // إذا سجل دخول، اعرض لوحة التحكم
  return <Dashboard user={session.user} />
}