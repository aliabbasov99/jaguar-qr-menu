require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// JSON faylının saxlanılacağı qovluq və fayl yolu
const dataDir = path.join(__dirname, 'data');
const filePath = path.join(dataDir, 'products.json');

// 1. data/products.json faylının mövcudluğunu yoxlayırıq, yoxdursa yaradırıq
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
}

// JSON faylından data oxumaq üçün köməkçi funksiya
const readProductsFromFile = () => {
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Fayldan data oxunarkən xəta:', error.message);
    return [];
  }
};

// JSON faylına data yazmaq üçün köməkçi funksiya
const writeProductsToFile = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Fayla data yazılarkən xəta:', error.message);
    return false;
  }
};

// GET /api/data endpoint-i (Fayldan oxuyur)
app.get('/api/data', (req, res) => {
  try {
    const dbData = readProductsFromFile();

    if (!dbData || dbData.length === 0) {
      return res.status(404).json({ message: 'JSON faylında heç bir data tapılmadı.' });
    }

    res.json(dbData);
  } catch (error) {
    console.error('Data oxunarkən xəta:', error.message);
    res.status(500).json({ error: 'Data oxunarkən xəta baş verdi.' });
  }
});

// POST /api/add-data endpoint-i (Köhnə datanı silib yeni datanı fayla yazır)
app.post('/api/add-data', (req, res) => {
  try {
    const incomingData = req.body;

    if (!incomingData || (Array.isArray(incomingData) && incomingData.length === 0) || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ error: 'Göndərilən JSON məlumatı boşdur.' });
    }

    // Göndərilən data obyektdirsə massivə (array) çeviririk
    const dataToInsert = Array.isArray(incomingData) ? incomingData : [incomingData];

    // Fayla yazırıq (köhnə datalar avtomatik silinir və sıfırdan yazılır)
    const isSuccess = writeProductsToFile(dataToInsert);

    if (!isSuccess) {
      return res.status(500).json({ error: 'Data JSON faylına yazılarkən xəta baş verdi.' });
    }

    // Yenilənmiş bütün məhsul siyahısını qaytarırıq
    const allProducts = readProductsFromFile();

    res.json(allProducts);

  } catch (error) {
    console.error('Əməliyyat zamanı xəta:', error.message);
    res.status(500).json({ error: 'Data işlənərkən xəta baş verdi.' });
  }
});

app.listen(5000, () => {
  console.log('Backend 5000 portunda çalışır');
});

module.exports = app;