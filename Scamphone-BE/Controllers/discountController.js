import asyncHandler from 'express-async-handler';
import Discount from '../Models/DiscountModel.js';

// @desc    Get all discounts (public - only active ones)
// @route   GET /api/v1/discounts
// @access  Public
const getDiscounts = asyncHandler(async (req, res) => {
  const now = new Date();
  const discounts = await Discount.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).select('-usedBy').sort('-createdAt');

  res.json(discounts);
});

// @desc    Validate discount code
// @route   POST /api/v1/discounts/validate
// @access  Public
const validateDiscount = asyncHandler(async (req, res) => {
  const { code, orderValue, userId } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Mã giảm giá không được để trống');
  }

  const discount = await Discount.findOne({ code: code.toUpperCase() });

  if (!discount) {
    res.status(404);
    throw new Error('Mã giảm giá không tồn tại');
  }

  const validation = discount.canUse(userId, orderValue || 0);

  if (!validation.valid) {
    res.status(400);
    throw new Error(validation.message);
  }

  const discountAmount = discount.calculateDiscount(orderValue || 0);

  res.json({
    valid: true,
    discount: {
      _id: discount._id,
      code: discount.code,
      name: discount.name,
      type: discount.type,
      value: discount.value,
      discountAmount,
      minOrderValue: discount.minOrderValue
    }
  });
});

// @desc    Get all discounts for admin
// @route   GET /api/v1/discounts/admin/all
// @access  Private/Admin
const getAdminDiscounts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [discounts, total] = await Promise.all([
    Discount.find(query)
      .select('-usedBy')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Discount.countDocuments(query)
  ]);

  res.json({
    discounts,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  });
});

// @desc    Get single discount
// @route   GET /api/v1/discounts/:id
// @access  Private/Admin
const getDiscountById = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id)
    .populate('applicableProducts', 'name price')
    .populate('applicableCategories', 'name');

  if (!discount) {
    res.status(404);
    throw new Error('Discount not found');
  }

  res.json(discount);
});

// @desc    Create discount
// @route   POST /api/v1/discounts
// @access  Private/Admin
const createDiscount = asyncHandler(async (req, res) => {
  const {
    name,
    code,
    description,
    type,
    value,
    maxDiscount,
    minOrderValue,
    startDate,
    endDate,
    maxUses,
    maxUsesPerUser,
    applicableProducts,
    applicableCategories
  } = req.body;

  // Check if code already exists
  const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
  if (existingDiscount) {
    res.status(400);
    throw new Error('Mã giảm giá đã tồn tại');
  }

  const discount = await Discount.create({
    name,
    code: code.toUpperCase(),
    description,
    type,
    value,
    maxDiscount: maxDiscount || 0,
    minOrderValue: minOrderValue || 0,
    startDate,
    endDate,
    maxUses,
    maxUsesPerUser: maxUsesPerUser || 1,
    applicableProducts: applicableProducts || [],
    applicableCategories: applicableCategories || [],
    status: 'active'
  });

  res.status(201).json(discount);
});

// @desc    Update discount
// @route   PUT /api/v1/discounts/:id
// @access  Private/Admin
const updateDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) {
    res.status(404);
    throw new Error('Discount not found');
  }

  const {
    name,
    code,
    description,
    type,
    value,
    maxDiscount,
    minOrderValue,
    startDate,
    endDate,
    maxUses,
    maxUsesPerUser,
    status,
    applicableProducts,
    applicableCategories
  } = req.body;

  // Check if new code conflicts with existing
  if (code && code.toUpperCase() !== discount.code) {
    const existing = await Discount.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400);
      throw new Error('Mã giảm giá đã tồn tại');
    }
  }

  discount.name = name || discount.name;
  discount.code = code ? code.toUpperCase() : discount.code;
  discount.description = description !== undefined ? description : discount.description;
  discount.type = type || discount.type;
  discount.value = value !== undefined ? value : discount.value;
  discount.maxDiscount = maxDiscount !== undefined ? maxDiscount : discount.maxDiscount;
  discount.minOrderValue = minOrderValue !== undefined ? minOrderValue : discount.minOrderValue;
  discount.startDate = startDate || discount.startDate;
  discount.endDate = endDate || discount.endDate;
  discount.maxUses = maxUses !== undefined ? maxUses : discount.maxUses;
  discount.maxUsesPerUser = maxUsesPerUser !== undefined ? maxUsesPerUser : discount.maxUsesPerUser;
  discount.status = status || discount.status;
  discount.applicableProducts = applicableProducts !== undefined ? applicableProducts : discount.applicableProducts;
  discount.applicableCategories = applicableCategories !== undefined ? applicableCategories : discount.applicableCategories;

  const updated = await discount.save();
  res.json(updated);
});

// @desc    Delete discount
// @route   DELETE /api/v1/discounts/:id
// @access  Private/Admin
const deleteDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);

  if (!discount) {
    res.status(404);
    throw new Error('Discount not found');
  }

  await Discount.deleteOne({ _id: req.params.id });
  res.json({ message: 'Discount removed' });
});

export {
  getDiscounts,
  validateDiscount,
  getAdminDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount
};
