import { createClient } from '@supabase/supabase-js'

// === انتبه جيداً هنا ===
// تأكد من أن هذه الأسماء تطابق الأسماء التي وضعتها في Vercel

// (الاحتمال 1: إذا كان مشروعك CRA - Create React App)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// (الاحتمال 2: إذا كان مشروعك Vite)
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// (الاحتمال 3: إذا كان مشروعك Next.js)
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY


// تأكد من تفعيل السطرين الصحيحين وإلغاء تفعيل البقية
// (أنا سأفترض أنه الاحتمال 1: REACT_APP)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)