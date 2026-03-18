const { validationResult } = require('express-validator');
const Application = require('../models/Application');
const Pet = require('../models/Pet');

// @desc    Submit adoption application
// @route   POST /api/applications
// @access  Private (user)
const submitApplication = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { petId, message, phoneNumber, address, hasOtherPets } = req.body;

    // Check pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This pet is currently ${pet.status} and not accepting applications`,
      });
    }

    // Check for existing application
    const existing = await Application.findOne({ user: req.user._id, pet: petId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this pet',
      });
    }

    const application = await Application.create({
      user: req.user._id,
      pet: petId,
      message,
      phoneNumber,
      address,
      hasOtherPets: hasOtherPets || false,
      status: 'pending',
    });

    // Update pet status to pending
    pet.status = 'pending';
    await pet.save();

    await application.populate([
      { path: 'pet', select: 'name species breed photo' },
      { path: 'user', select: 'name email' },
    ]);

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own applications
// @route   GET /api/applications/mine
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('pet', 'name species breed photo status')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications
// @access  Admin
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate('pet', 'name species breed photo status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: applications,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (approve/reject)
// @route   PATCH /api/applications/:id
// @access  Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (adminNote !== undefined) application.adminNote = adminNote;
    await application.save();

    // If approved, update pet status to adopted and reject all other pending applications
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(application.pet, { status: 'adopted' });

      // Reject all other pending applications for this pet
      await Application.updateMany(
        { pet: application.pet, _id: { $ne: application._id }, status: 'pending' },
        { status: 'rejected', adminNote: 'Another applicant was approved for this pet' }
      );
    }

    // If rejected and no more pending applications, reset pet to available
    if (status === 'rejected') {
      const pendingCount = await Application.countDocuments({
        pet: application.pet,
        status: 'pending',
      });

      const approvedCount = await Application.countDocuments({
        pet: application.pet,
        status: 'approved',
      });

      if (pendingCount === 0 && approvedCount === 0) {
        await Pet.findByIdAndUpdate(application.pet, { status: 'available' });
      }
    }

    await application.populate([
      { path: 'pet', select: 'name species breed photo status' },
      { path: 'user', select: 'name email' },
    ]);

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'name email')
      .populate('pet', 'name species breed photo status');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Only owner or admin can view
    if (
      application.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationById,
};
