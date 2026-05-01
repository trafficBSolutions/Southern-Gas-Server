require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const contactRoutes = require('./routes/contactRoute');
const quoteRoutes = require('./routes/quoteRoute');
const careerRoutes = require('./routes/careerRoute');
const authRoutes = require('./routes/authRoute');
const adminQuoteRoutes = require('./routes/adminQuoteRoute');
const jobRoutes = require('./routes/jobRoute');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5173', 'https://www.southerngassolutions.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// XSS sanitizer — AFTER json parser
app.use((req, _res, next) => {
  const clean = (obj) => {
    if (typeof obj === 'string') return obj.replace(/[<>]/g, '');
    if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) obj[key] = clean(obj[key]);
    }
    return obj;
  };
  if (req.body) req.body = clean(req.body);
  next();
});

// Test route
app.get('/api/ping', (_req, res) => res.json({ pong: true }));

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/admin-quotes', adminQuoteRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Database Connected'))
  .catch((err) => console.error('❌ Database Not Connected', err));
