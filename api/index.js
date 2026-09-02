const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Faylların tam yolları (data/products.json və data/test.json)
const filePath = path.join(__dirname, 'data', 'products.json');
const filePathTest = path.join(__dirname, 'data', 'test.json');

// Lokal faylı oxumaq üçün köməkçi funksiya
const getLocalData = () => {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return fileData ? JSON.parse(fileData) : null;
};

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
        timeout: 5000 // İsteğe bağlı: Sorğunun ilişib qalmaması üçün taymout (ms)
      }
    );

    const apiData = response.data;
    const localData = getLocalData();

    // 2. Gələn cavabı mövcud faylla müqayisə edirik
    if (JSON.stringify(apiData) !== JSON.stringify(localData)) {
      // Əgər fərqlidirsə, products.json faylına yazırıq
      fs.writeFileSync(filePath, JSON.stringify(apiData, null, 2), 'utf-8');
    }

    // Əsas cavabı qaytarırıq
    res.json(apiData);

  } catch (error) {
    console.error('API Xətası, lokal fayldan oxunur:', error.message);

    // 3. API-dən cavab gəlmədikdə / xəta olduqda faylı oxuyub cavab veririk
    try {
      const localData = getLocalData();
      if (localData) {
        return res.json(localData);
      }
      
      res.status(500).json({ error: 'Nə API-dən cavab gəldi, nə də lokal faylda data var.' });
    } catch (fsError) {
      res.status(500).json({ error: 'Lokal fayl oxunarkən xəta baş verdi.' });
    }
  }
});

// test.json-u oxuyan, gələn JSON-u siyahıya əlavə edib yazan və qaytaran POST endpoint-i
app.post('/api/add-data', (req, res) => {
  try {
    const incomingData = req.body;

    // Göndərilən məlumatın boş olub-olmadığını yoxlayırıq
    if (!incomingData || Object.keys(incomingData).length === 0) {
      return res.status(400).json({ error: 'Göndərilən JSON məlumatı boşdur.' });
    }

    let testList = [];

    // 1. test.json faylı var-yoxluğunu və məzmununu yoxlayırıq
    if (fs.existsSync(filePathTest)) {
      const fileData = fs.readFileSync(filePathTest, 'utf-8');
      if (fileData) {
        const parsedData = JSON.parse(fileData);
        // Əgər fayldakı məlumat massivdirsə götürürük, deyilsə siyahıya çeviririk
        testList = Array.isArray(parsedData) ? parsedData : [parsedData];
      }
    }

    // 2. Gələn yeni JSON məlumatını siyahının sonuna əlavə edirik
    testList.push(incomingData);

    // 3. Yenilənmiş siyahını test.json faylına yazırıq
    fs.writeFileSync(filePathTest, JSON.stringify(testList, null, 2), 'utf-8');

    // 4. Yenilənmiş siyahını cavab olaraq qaytarırıq
    res.json(testList);

  } catch (error) {
    console.error('test.json əməliyyatı zamanı xəta:', error.message);
    res.status(500).json({ error: 'Fayl oxunarkən və ya yazılarkən xəta baş verdi.' });
  }
});

app.listen(5000, () => {
  console.log('Backend 5000 portunda çalışır');
});

module.exports = app;