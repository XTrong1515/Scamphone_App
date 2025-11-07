import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import slugify from 'slugify';

// @desc    Fetch all products with filters, pagination, search
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sort = '-createdAt',
    isNewProduct,
    isHot
  } = req.query;

  const query = { status: 'active' };

  // Filters
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  if (isNewProduct === 'true') query.isNewProduct = true;
  if (isHot === 'true') query.isHot = true;

  const skip = (Number(page) - 1) * Number(limit);
  
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  });
});

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    stock_quantity,
    category,
    brand,
    images,
    image,
    specifications,
    discount,
    isHot
  } = req.body;

  // Generate unique slug
  let slug = slugify(name, { lower: true, strict: true });
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = new Product({
    name,
    description,
    price,
    originalPrice: originalPrice || price,
    stock_quantity,
    category,
    brand,
    images: images || [],
    image: image || (images && images[0]) || '',
    specifications: specifications || {},
    discount: discount || 0,
    isHot: isHot || false,
    isNewProduct: true, // Always true for new products
    slug,
    status: stock_quantity > 0 ? 'active' : 'out_of_stock'
  });

  const createdProduct = await product.save();
  const populatedProduct = await Product.findById(createdProduct._id).populate('category', 'name');
  
  res.status(201).json(populatedProduct);
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const {
    name,
    description,
    price,
    originalPrice,
    stock_quantity,
    category,
    brand,
    images,
    image,
    specifications,
    discount,
    isHot,
    isNewProduct,
    status
  } = req.body;

  // Update slug if name changed
  if (name && name !== product.name) {
    product.slug = slugify(name, { lower: true, strict: true });
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price !== undefined ? price : product.price;
  product.originalPrice = originalPrice || product.originalPrice;
  product.stock_quantity = stock_quantity !== undefined ? stock_quantity : product.stock_quantity;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.images = images || product.images;
  product.image = image || product.image;
  product.specifications = specifications || product.specifications;
  product.discount = discount !== undefined ? discount : product.discount;
  product.isHot = isHot !== undefined ? isHot : product.isHot;
  product.isNewProduct = isNewProduct !== undefined ? isNewProduct : product.isNewProduct;
  product.status = status || (stock_quantity > 0 ? 'active' : 'out_of_stock');

  const updatedProduct = await product.save();
  const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name');

  res.json(populatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: req.params.id });
  res.json({ message: 'Product removed' });
});

// @desc    Get all products for admin (including inactive)
// @route   GET /api/v1/products/admin/all
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, category, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts
};