const multer = require('multer');
const path = require('path');

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where files will be uploaded
    cb(null, path.join(__dirname, '../uploads')); // Make sure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    // Set the file name format (you can modify this as needed)
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, fileName);
  }
});

// Create the Multer upload middleware instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files (optional)
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) && 
                    allowedFileTypes.test(file.mimetype);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Optional: Set the file size limit (5MB)
});

module.exports = upload;
