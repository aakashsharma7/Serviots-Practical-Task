const { validationResult } = require('express-validator');
const Pet = require('../models/Pet');

// @desc    Get all pets with search, filter, pagination
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res, next) => {
  try {
    const {
      search,
      species,
      breed,
      minAge,
      maxAge,
      status,
      gender,
      size,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search by name or breed
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
      ];
    }

    if (species) query.species = species;
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    if (gender) query.gender = gender;
    if (size) query.size = size;

    // Only show available by default for public
    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
    }

    if (minAge !== undefined || maxAge !== undefined) {
      query.age = {};
      if (minAge !== undefined) query.age.$gte = Number(minAge);
      if (maxAge !== undefined) query.age.$lte = Number(maxAge);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: pets,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pet
// @route   POST /api/pets
// @access  Admin
const createPet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const petData = { ...req.body };
    if (req.file) {
      petData.photo = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.create(petData);
    res.status(201).json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Admin
const updatePet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: pet });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Admin
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    await pet.deleteOne();
    res.json({ success: true, message: 'Pet removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin get all pets (including all statuses)
// @route   GET /api/pets/admin/all
// @access  Admin
const getAllPetsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean();

    res.json({
      success: true,
      data: pets,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPets, getPetById, createPet, updatePet, deletePet, getAllPetsAdmin };
