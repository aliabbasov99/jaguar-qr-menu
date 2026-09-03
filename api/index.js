require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// 1. MongoDB-yə qoşulma
const mongoURI = process.env.MONGO_DB_URL;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB-yə uğurla qoşuldu'))
  .catch((err) => console.error('MongoDB qoşulma xətası:', err));

// 2. Mongoose Modellərinin təyini

// Product Sxemi (Promar API-dən gələn datanı saxlayacaq)
const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

// Test Data Sxemi (POST sorğuları ilə gələn datanı saxlayacaq)
const TestDataSchema = new mongoose.Schema({}, { strict: false });
const TestData = mongoose.model('TestData', TestDataSchema);

// GET /api/data endpoint-i
app.get('/api/data', async (req, res) => {
  try {
    // 1. Promar API-yə sorğu göndəririk
    const response = await axios.post(
      'http://promar.az/REST/hs/Api',
      {},
      {
        auth: {
          username: 'admin',
          password: ''
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    const apiData = response.data;

    // API-dən datanın massiv və ya obyekt gəldiyini nəzərə alaraq baza ilə müqayisə edirik
    const dbData = await Product.find({}, { _id: 0, __v: 0 }).lean();

    // Datanı müqayisə etmək üçün JSON formatına çeviririk
    const apiDataNormalized = Array.isArray(apiData) ? apiData : [apiData];

    if (JSON.stringify(apiDataNormalized) !== JSON.stringify(dbData)) {
      // Data fərqlidirsə, köhnələri silib yenilərini bazaya yazırıq
      await Product.deleteMany({});
      if (Array.isArray(apiData)) {
        await Product.insertMany(apiData);
      } else {
        await Product.create(apiData);
      }
    }

    res.json(apiData);

  } catch (error) {
    console.error('API Xətası, MongoDB-dən oxunur:', error.message);

    // 2. API işləmədikdə MongoDB-dən məlumatı götürürük
    try {
      const dbData = await Product.find({}, { _id: 0, __v: 0 }).lean();
      
      if (dbData && dbData.length > 0) {
        return res.json(dbData);
      }
      
      res.status(500).json({ error: 'Nə API-dən cavab gəldi, nə də MongoDB-də data var.' });
    } catch (dbError) {
      res.status(500).json({ error: 'MongoDB-dən data oxunarkən xəta baş verdi.' });
    }
  }
});

// POST /api/add-data endpoint-i
app.post('/api/add-data', async (req, res) => {
  try {
    const incomingData = req.body;

    if (!incomingData || (Array.isArray(incomingData) && incomingData.length === 0) || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ error: 'Göndərilən JSON məlumatı boşdur.' });
    }

    // Əgər incomingData massivdirsə insertMany, tək obyektdirsə create istifadə edirik
    if (Array.isArray(incomingData)) {
      await TestData.insertMany(incomingData);
    } else {
      await TestData.create(incomingData);
    }

    // Yenilənmiş bütün siyahını MongoDB-dən oxuyub qaytarırıq
    const allTestData = await TestData.find({}, { _id: 0, __v: 0 }).lean();

    res.json(allTestData);

  } catch (error) {
    console.error('MongoDB əməliyyatı zamanı xəta:', error.message);
    res.status(500).json({ error: 'Data MongoDB-yə yazılarkən xəta baş verdi.' });
  }
});

app.listen(5000, () => {
  console.log('Backend 5000 portunda çalışır');
});

module.exports = app;