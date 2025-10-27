require('dotenv').config();   // تحميل متغيرات البيئة
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connectDB } = require('./db'); // استدعاء ملف الاتصال
connectDB(); // تشغيل الاتصال عند بدء المشروع

const app = express();
app.use(cors());
app.use(bodyParser.json());

// باقي الكود: Routes, app.listen, إلخ
