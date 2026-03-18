const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      lowercase: true,
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [30, 'Age seems too high'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown',
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'medium',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
    photo: {
      type: String,
      default: '',
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Text index for search
petSchema.index({ name: 'text', breed: 'text' });

module.exports = mongoose.model('Pet', petSchema);
