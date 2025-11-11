import asyncHandler from 'express-async-handler';
import Order from '../Models/OrderModel.js';
import Product from '../Models/ProductModel.js';
import { createNotification } from './notificationController.js';

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm trong đơn hàng');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
    res.status(400);
    throw new Error('Thông tin địa chỉ giao hàng không đầy đủ');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    totalPrice,
    status: 'pending'
  });

  const createdOrder = await order.save();
  
  res.status(201).json(createdOrder);
});


// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (order && (req.user.role === 'admin' || order.user._id.equals(req.user._id))) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng');
    }
});


// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('orderItems.product')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('orderItems.product')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }

  order.status = status;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  
  // Tạo thông báo cho user
  let notificationTitle = 'Cập nhật đơn hàng';
  let notificationMessage = `Đơn hàng #${order._id.toString().slice(-8)} của bạn đã được cập nhật trạng thái: ${status}`;
  
  if (status === 'delivered') {
    notificationTitle = 'Đơn hàng đã giao thành công';
    notificationMessage = `Đơn hàng #${order._id.toString().slice(-8)} đã được giao thành công. Cảm ơn bạn đã mua hàng!`;
  } else if (status === 'shipping') {
    notificationTitle = 'Đơn hàng đang được giao';
    notificationMessage = `Đơn hàng #${order._id.toString().slice(-8)} đang trên đường giao đến bạn.`;
  }

  await createNotification(order.user, {
    type: status === 'delivered' ? 'order_delivered' : 'order_shipped',
    title: notificationTitle,
    message: notificationMessage,
    order: order._id
  });

  res.json(updatedOrder);
});

// @desc    Confirm order (Admin) - Deduct stock
// @route   PUT /api/v1/orders/:id/confirm
// @access  Private/Admin
const confirmOrder = asyncHandler(async (req, res) => {
  console.log('[CONFIRM ORDER] Order ID:', req.params.id);
  const order = await Order.findById(req.params.id).populate('orderItems.product');

  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Đơn hàng đã được xử lý');
  }

  // Kiểm tra tồn kho
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Không tìm thấy sản phẩm: ${item.name}`);
    }
    if (product.stock_quantity < item.quantity) {
      res.status(400);
      throw new Error(`Sản phẩm ${item.name} không đủ hàng trong kho (Còn: ${product.stock_quantity}, Cần: ${item.quantity})`);
    }
  }

  // Trừ số lượng tồn kho
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock_quantity -= item.quantity;
      await product.save();
    }
  }

  order.status = 'processing';
  const updatedOrder = await order.save();

  // Tạo thông báo cho user
  await createNotification(order.user, {
    type: 'order_confirmed',
    title: 'Đơn hàng đã được xác nhận',
    message: `Đơn hàng #${order._id.toString().slice(-8)} của bạn đã được xác nhận và đang được chuẩn bị. Tổng tiền: ${order.totalPrice.toLocaleString()}₫`,
    order: order._id
  });

  res.json(updatedOrder);
});

// @desc    Reject order (Admin) with reason
// @route   PUT /api/v1/orders/:id/reject
// @access  Private/Admin
const rejectOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }

  if (order.status !== 'pending') {
    res.status(400);
    throw new Error('Chỉ có thể từ chối đơn hàng đang chờ xử lý');
  }

  if (!reason || reason.trim() === '') {
    res.status(400);
    throw new Error('Vui lòng nhập lý do từ chối');
  }

  order.status = 'cancelled';
  order.rejectionReason = reason;
  const updatedOrder = await order.save();

  // Tạo thông báo cho user
  await createNotification(order.user, {
    type: 'order_rejected',
    title: 'Đơn hàng đã bị từ chối',
    message: `Đơn hàng #${order._id.toString().slice(-8)} của bạn đã bị từ chối. Lý do: ${reason}`,
    order: order._id,
    metadata: { rejectionReason: reason }
  });

  res.json(updatedOrder);
});

export { 
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getAllOrders,
  updateOrderStatus,
  confirmOrder,
  rejectOrder
};
