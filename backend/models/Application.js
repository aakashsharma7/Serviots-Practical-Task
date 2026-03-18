const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message for your application'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    hasOtherPets: {
      type: Boolean,
      default: false,
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// One application per user per pet
applicationSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
