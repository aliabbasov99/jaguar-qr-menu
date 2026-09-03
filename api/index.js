require('dotenv').config({ quiet: true });
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

// GET /api/data endpoint-i (Birbaşa MongoDB-dən oxuyur)
app.get('/api/data', async (req, res) => {
  try {
    const dbData = await Product.find({}, { _id: 0, __v: 0 }).lean();

    if (!dbData || dbData.length === 0) {
      return res.status(404).json({ message: 'MongoDB-də heç bir data tapılmadı.' });
    }

    res.json(dbData);
  } catch (error) {
    console.error('MongoDB-dən oxunarkən xəta:', error.message);
    res.status(500).json({ error: 'MongoDB-dən data oxunarkən xəta baş verdi.' });
  }
});

// POST /api/add-data endpoint-i (Artıq Product kolleksiyasına yazır)
app.post('/api/add-data', async (req, res) => {
  try {
    const incomingData = req.body;

    if (!incomingData || (Array.isArray(incomingData) && incomingData.length === 0) || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ error: 'Göndərilən JSON məlumatı boşdur.' });
    }

    // 1. Kolleksiyadakı mövcut BÜTÜN məlumatları silirik
    await Product.deleteMany({});

    // 2. Göndərilən data obyektdirsə, onu massivə (array) çeviririk
    const dataToInsert = Array.isArray(incomingData) ? incomingData : [incomingData];

    // 3. Yeni məlumatları sıfırdan yazırıq
    await Product.insertMany(dataToInsert);

    // 4. Yenilənmiş bütün məhsul siyahısını MongoDB-dən oxuyub qaytarırıq
    const allProducts = await Product.find({}, { _id: 0, __v: 0 }).lean();

    res.json(allProducts);

  } catch (error) {
    console.error('MongoDB əməliyyatı zamanı xəta:', error.message);
    res.status(500).json({ error: 'Data MongoDB-yə yazılarkən xəta baş verdi.' });
  }
});

app.listen(5000, () => {
  console.log('Backend 5000 portunda çalışır');
});

module.exports = app;