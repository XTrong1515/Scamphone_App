import asyncHandler from 'express-async-handler';
import Category from '../Models/CategoryModel.js';

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
});

// @desc Create new category
// @route POST /api/v1/categories
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }

  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = new Category({ name });
  const created = await category.save();
  res.status(201).json(created);
});

// @desc Update category
// @route PUT /api/v1/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  const { name } = req.body;
  if (name) category.name = name;
  const updated = await category.save();
  res.json(updated);
});

// @desc Delete category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.remove();
  res.json({ message: 'Category removed' });
});

export { getCategories, createCategory, updateCategory, deleteCategory };
