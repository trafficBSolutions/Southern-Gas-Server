require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const contactRoutes = require('./routes/contactRoute');
const quoteRoutes = require('./routes/quoteRoute');
const careerRoutes = require('./routes/careerRoute');

const app = express();

app.use(helmet());
app.use(compression());
app.use(xss());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5173', 'https://www.southerngassolutions.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/contact', contactRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/careers', careerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// ✅ Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Database Connected');
    // Optional: call a post-connection function here (e.g., cleanup)
  })
  .catch((err) => console.error('❌ Database Not Connected', err));
