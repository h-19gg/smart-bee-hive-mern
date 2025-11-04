// نستدعي الملف الذي أنشأناه
import { supabase } from './supabaseClient';

// هذه الدالة الجديدة ستقرأ آخر قراءة من Supabase
export const getLatestSensorData = async () => {
  try {
    // هذا هو الأمر لقراءة البيانات من جدولك
    let { data, error } = await supabase
      .from('beehive_data') // اسم الجدول
      .select('*')          // اختر كل الأعمدة
      .order('created_at', { ascending: false }) // رتبها من الأحدث للأقدم
      .limit(1); // أعد آخر قراءة واحدة فقط

    if (error) {
      // إذا حدث خطأ، أظهره في الكونسول
      console.error("Supabase read error:", error);
      throw error;
    }

    if (data && data.length > 0) {
      // إذا نجح، أعد البيانات
      return data[0];
    } else {
      // إذا لم يجد بيانات
      return null;
    }

  } catch (error) {
    console.error("Error in getLatestSensorData:", error.message);
    return null; // أعد "لا شيء" إذا فشل
  }
};

// --- ملاحظة ---
// إذا كان لديك دوال أخرى في هذا الملف (مثل login, register)
// اتركها كما هي ولا تحذفها.
// فقط احذف الدالة القديمة التي كانت تجلب "بيانات الحساسات".