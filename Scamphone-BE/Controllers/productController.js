import asyncHandler from 'express-async-handler';
import Product from '../Models/ProductModel.js';
import slugify from 'slugify';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchRegex = (rawQuery = '') => {
  const normalized = rawQuery.trim().replace(/\s+/g, ' ');
  if (!normalized) return null;
  const tokens = normalized.split(' ').map(token => escapeRegex(token));
  const pattern = tokens.join('.*');
  return new RegExp(pattern, 'i');
};

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
    isHot,
    status // Allow filtering by status
  } = req.query;

  // Don't filter by status by default - show all products
  // Frontend will handle display logic based on status
  const query = {};
  
  // Only filter by status if explicitly requested
  if (status) {
    query.status = status;
  }

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
    isHot,
    attributes,
    variants
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
    attributes: attributes || [],
    variants: variants || [],
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
    status,
    attributes,
    variants
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
  product.attributes = attributes !== undefined ? attributes : product.attributes;
  product.variants = variants !== undefined ? variants : product.variants;

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

// @desc    Advanced product search with fuzzy matching
// @route   GET /api/v1/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const {
    q = '',
    category,
    brand,
    priceRange,
    rating,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
    status // optional explicit status filter
  } = req.query;

  const regex = buildSearchRegex(q);

  if (!regex) {
    return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
  }

  const query = {
    $or: [
      { name: regex },
      { slug: regex },
      { brand: regex },
      { description: regex },
      { 'attributes.name': regex },
      { 'attributes.values': regex }
    ]
  };

  // Only apply status filter if explicitly provided; otherwise include everything except 'inactive'
  if (status) {
    query.status = status;
  } else {
    query.status = { $ne: 'inactive' };
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    const brandList = Array.isArray(brand)
      ? brand
      : String(brand)
          .split(',')
          .map((b) => b.trim())
          .filter(Boolean);
    if (brandList.length) {
      query.brand = { $in: brandList };
    }
  }

  if (priceRange) {
    const [min, max] = String(priceRange)
      .split('-')
      .map((value) => Number(value));
    query.price = {};
    if (!Number.isNaN(min)) query.price.$gte = min;
    if (!Number.isNaN(max)) query.price.$lte = max;
    if (Object.keys(query.price).length === 0) {
      delete query.price;
    }
  }

  if (rating) {
    const minRating = Number(rating);
    if (!Number.isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 }
  };

  const sortOption = sortMap[sortBy] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query)
  ]);

  res.json({
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit))
  });
});

// @desc    Get available brands
// @route   GET /api/v1/products/brands
// @access  Public
const getBrands = asyncHandler(async (_req, res) => {
  const brands = await Product.distinct('brand', {
    brand: { $ne: null },
    status: 'active'
  });

  res.json(brands.filter(Boolean).sort());
});

// @desc    Get price range of products
// @route   GET /api/v1/products/price-range
// @access  Public
const getPriceRange = asyncHandler(async (_req, res) => {
  const [result] = await Product.aggregate([
    { $match: { price: { $gt: 0 } } },
    {
      $group: {
        _id: null,
        min: { $min: '$price' },
        max: { $max: '$price' }
      }
    }
  ]);

  res.json({
    min: result?.min ?? 0,
    max: result?.max ?? 0
  });
});

// @desc    Search suggestions
// @route   GET /api/v1/products/suggestions
// @access  Public
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q = '' } = req.query;
  const regex = buildSearchRegex(q);

  if (!regex) {
    return res.json([]);
  }

  const products = await Product.find({
    status: 'active',
    name: regex
  })
    .select('name brand')
    .limit(10);

  const suggestions = [];
  const seen = new Set();

  products.forEach((product) => {
    if (product.name && !seen.has(product.name)) {
      suggestions.push(product.name);
      seen.add(product.name);
    }
    if (product.brand) {
      const normalizedName = product.name.replace(new RegExp(product.brand, 'i'), '').trim();
      const brandSuggestion = `${product.brand} ${normalizedName}`.trim();
      if (brandSuggestion && !seen.has(brandSuggestion)) {
        suggestions.push(brandSuggestion);
        seen.add(brandSuggestion);
      }
    }
  });

  res.json(suggestions.slice(0, 10));
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  searchProducts,
  getBrands,
  getPriceRange,
  getSearchSuggestions
};