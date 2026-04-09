const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'customer') {
      res.status(403);
      throw new Error('Only customers can create orders');
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('items is required and must contain at least one product');
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity)
    }));

    for (const item of normalizedItems) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
        res.status(400);
        throw new Error('Each item must include a valid productId and quantity >= 1');
      }
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      res.status(400);
      throw new Error('One or more products do not exist');
    }

    const productMap = new Map(products.map((product) => [String(product._id), product]));
    let totalAmount = 0;

    for (const item of normalizedItems) {
      const product = productMap.get(String(item.productId));

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
    }

    for (const item of normalizedItems) {
      const product = productMap.get(String(item.productId));
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user._id,
      items: normalizedItems,
      totalAmount,
      status: 'pending'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email role')
      .populate('items.productId', 'name price category image');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'customer') {
      res.status(403);
      throw new Error('Only customers can access their orders');
    }

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name price category image');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email role')
      .populate('items.productId', 'name price category image');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('status is required');
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('userId', 'name email role')
      .populate('items.productId', 'name price category image');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};