const fs = require('fs');
const path = require('path');
const multer = require('multer');
const env = require('../config/env');

const productUploadDir = path.resolve(__dirname, '../../', env.uploadDir, 'products');
fs.mkdirSync(productUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: productUploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed.'));
    }
    cb(null, true);
  },
});

module.exports = { imageUpload };
