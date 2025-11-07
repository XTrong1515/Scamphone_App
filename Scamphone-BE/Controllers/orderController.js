import asyncHandler from 'express-async-handler';
import Order from '../Models/OrderModel.js';
import Product from '../Models/ProductModel.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shipping_address, phone_number } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Lấy thông tin sản phẩm từ DB để đảm bảo giá chính xác
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x.product) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (item) => item._id.toString() === itemFromClient.product
    );
    if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient.product}`);
    }
    return {
      product: itemFromClient.product,
      quantity: itemFromClient.quantity,
      price: matchingItemFromDB.price, // Dùng giá từ DB, không tin client
    };
  });

  // Tính tổng tiền
  const total_amount = dbOrderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const order = new Order({
    user: req.user._id,
    items: dbOrderItems,
    shipping_address,
    phone_number,
    total_amount
  });
  
  // Trừ số lượng tồn kho
  for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
          product.stock_quantity -= item.quantity;
          await product.save();
      }
  }

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});


// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name price');

    if (order && (req.user.role === 'admin' || order.user._id.equals(req.user._id))) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { addOrderItems, getOrderById, getMyOrders };