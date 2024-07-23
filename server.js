const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/encrypt', (req, res) => {
  const { plaintext } = req.body;
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32); // 256-bit key
  const iv = crypto.randomBytes(16); // Initialization Vector

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  res.json({ ciphertext: iv.toString('hex') + encrypted });
});

app.post('/decrypt', (req, res) => {
  const { ciphertext } = req.body;
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32); // 256-bit key

  const iv = Buffer.from(ciphertext.slice(0, 32), 'hex');
  const encryptedText = ciphertext.slice(32);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  res.json({ plaintext: decrypted });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
