# Smart Bee Hive (MERN) — Eng.Husein Al-Khazaali

تم إنشاء هذا المشروع تلقائيًا بتاريخ 2025-08-20.
يتكوّن من **Backend (Node/Express/MongoDB)** و **Frontend (React + Vite)**.

## المتطلبات
- Node.js v18 أو أحدث
- حساب مجاني على MongoDB Atlas (لتشغيل قاعدة البيانات على السحابة)

## 1) إعداد قاعدة البيانات (MongoDB Atlas)
1. أنشئ Cluster مجاني (M0) على MongoDB Atlas.
2. أنشئ مستخدم قاعدة بيانات وحدد كلمة مرور.
3. أضف عنوان IP: 0.0.0.0/0 مؤقتًا للتجربة (أو أضف IP خادمك).
4. انسخ Connection String وعدّل اسم قاعدة البيانات إلى `smartbeehive`.

## 2) تشغيل الـ Backend محليًا
```
cd backend
copy .env.example .env   # على ويندوز استخدم copy، على لينكس/ماك cp
# افتح .env وعدّل:
# MONGO_URI=
# JWT_SECRET=
# CORS_ORIGIN=http://localhost:3000
npm install
npm start
```

## 3) تشغيل الـ Frontend محليًا
```
cd ../frontend
# اختياري: أنشئ ملف .env وضع:
# VITE_API_BASE=http://localhost:5000
npm install
npm run dev
```
افتح: http://localhost:3000

## نقاط التكامل مع أجهزة الاستشعار (الدارة)
- endpoint: POST /api/readings
- Auth: Bearer Token (JWT)
- Body JSON:
```json
{ "hiveId": "<ObjectId>", "temperature": 31.2, "humidity": 60, "soundLevel": 42, "weight": 12.7 }
```

## نشر الإنتاج
- الواجهة (frontend) → Vercel
- الـ Backend → Render أو أي VPS/Node Server
- قاعدة البيانات → MongoDB Atlas
