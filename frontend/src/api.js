// نستدعي الملف الذي أنشأناه
import { supabase } from './supabaseClient';

// هذه هي الدالة *الوحيدة* التي نحتاجها من هذا الملف
export const getLatestSensorData = async () => {
  try {
    let { data, error } = await supabase
      .from('beehive_data') // اسم الجدول
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) { throw error; }
    if (data && data.length > 0) { return data[0]; }
    return null;

  } catch (error) {
    console.error("Error in getLatestSensorData:", error.message);
    return null;
  }
};