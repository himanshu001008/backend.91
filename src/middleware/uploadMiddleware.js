const multer = require('multer');
const path = require('path');
const { getBucket } = require('../config/firebase');

/**
 * Configure Multer Memory Storage
 * Keeps the file in memory buffer (req.file.buffer) for direct Firebase upload.
 */
const storage = multer.memoryStorage();

/**
 * File Filter: Restrict uploads to image formats only
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.'), false);
  }
};

/**
 * Multer Instance with 5MB size limit
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB Max File Size limit
  }
});

/**
 * Helper function: Upload buffer to Firebase Storage and return Public URL
 */
const uploadImageToFirebase = async (file) => {
  const bucket = getBucket();
  if (!bucket) {
    throw new Error('Firebase Storage is not configured properly. Please set Firebase environment variables in .env');
  }

  // Generate unique filename: classes/timestamp-random-extension
  const fileExtension = path.extname(file.originalname);
  const uniqueFilename = `classes/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

  const blob = bucket.file(uniqueFilename);

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    },
    resumable: false
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      reject(error);
    });

    blobStream.on('finish', async () => {
      try {
        // Make file publicly readable
        await blob.makePublic();

        // Construct public downloadable URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Combined Middleware: Intercept single image upload from 'image' field and upload to Firebase
 */
const handleImageUpload = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds maximum limit of 5MB'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Multer upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // If an image file was provided in form-data
    if (req.file) {
      try {
        const imageUrl = await uploadImageToFirebase(req.file);
        req.body.imageUrl = imageUrl; // Save resulting image URL in req.body
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: `Firebase image upload failed: ${uploadError.message}`
        });
      }
    }

    next();
  });
};

module.exports = {
  upload,
  uploadImageToFirebase,
  handleImageUpload
};
