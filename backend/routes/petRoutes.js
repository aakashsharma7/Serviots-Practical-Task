const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getAllPetsAdmin,
} = require('../controllers/petController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { petValidators } = require('../validators/petValidators');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `pet-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get('/', getPets);
router.get('/admin/all', protect, admin, getAllPetsAdmin);
router.get('/:id', getPetById);

// Admin
router.post('/', protect, admin, upload.single('photo'), petValidators, createPet);
router.put('/:id', protect, admin, upload.single('photo'), updatePet);
router.delete('/:id', protect, admin, deletePet);

module.exports = router;
