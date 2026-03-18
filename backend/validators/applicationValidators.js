const { body } = require('express-validator');

const applicationValidators = [
  body('petId').notEmpty().withMessage('Pet ID is required').isMongoId().withMessage('Invalid pet ID'),
  body('message')
    .trim()
    .notEmpty().withMessage('Application message is required')
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('phoneNumber').optional().trim(),
  body('address').optional().trim(),
];

module.exports = { applicationValidators };
