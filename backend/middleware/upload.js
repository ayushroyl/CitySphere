const multer = require('multer');
const path = require('path');

// Configure storage dynamically based on the folder name
const configureStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../uploads/${folderName}`)); // Destination folder
    },
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
      cb(null, fileName);
    },
  });
};

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase()) &&
                  allowedFileTypes.test(file.mimetype);
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Middleware for profile picture upload (single file)
const uploadProfile = multer({
  storage: configureStorage('profile'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('profilePicture'); // For single file upload with field name "profilePicture"

// Middleware for flat pictures upload (multiple files)
const uploadFlatPhotos = multer({
  storage: configureStorage('flats'),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB per file
}).array('flatPictures', 5); // Array upload with a limit of 5 files and field name "photos"

module.exports = {
  uploadProfile,
  uploadFlatPhotos,
};