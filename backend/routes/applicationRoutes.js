const express = require('express');
const {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { applicationValidators } = require('../validators/applicationValidators');

const router = express.Router();

router.post('/', protect, applicationValidators, submitApplication);
router.get('/mine', protect, getMyApplications);
router.get('/', protect, admin, getAllApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id', protect, admin, updateApplicationStatus);

module.exports = router;
