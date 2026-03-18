const { body } = require('express-validator');

const petValidators = [
  body('name').trim().notEmpty().withMessage('Pet name is required'),
  body('species')
    .notEmpty().withMessage('Species is required')
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'other']).withMessage('Invalid species'),
  body('breed').trim().notEmpty().withMessage('Breed is required'),
  body('age')
    .isNumeric().withMessage('Age must be a number')
    .isFloat({ min: 0, max: 30 }).withMessage('Age must be between 0 and 30'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
];

module.exports = { petValidators };
