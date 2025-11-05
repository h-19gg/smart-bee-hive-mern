import { supabase } from './supabaseClient';

// =======================================================
// الجزء 1: دوال تسجيل الدخول (التي ستعمل على Vercel)
// =======================================================

// هذه هي الدالة التي يستخدمها App.jsx لتسجيل الدخول والإنشاء
export const api = async (url, method, body, token) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
      options.body = JSON.stringify(body);
    }

    // === هذا هو الإصلاح الأهم ===
    // حذفنا رابط "Render"
    // Vercel سيفهم أن '/api/...' يجب أن تذهب إلى الخادم الخلفي
    const res = await fetch(url, options); // 'url' ستكون مثلاً '/api/auth/login'
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'حدث خطأ ما');
    }
    return data;

  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};


// =======================================================
// الجزء 2: دالة جلب بيانات الحساسات (من Supabase)
// =======================================================
export const getLatestSensorData = async () => {
  try {
    // هذا هو الأمر لقراءة البيانات من جدولك
    let { data, error } = await supabase
      .from('beehive_data') // اسم الجدول
      .select('*')          // اختر كل الأعمدة
      .order('created_at', { ascending: false }) // رتبها من الأحدث للأقدم
      .limit(1); // أعد آخر قراءة واحدة فقط

    if (error) {
      console.error("Supabase read error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      return data[0]; // إذا نجح، أعد البيانات
    } else {
      return null; // إذا لم يجد بيانات
    }

  } catch (error) {
    console.error("Error in getLatestSensorData:", error.message);
    return null; // أعد "لا شيء" إذا فشل
  }
};