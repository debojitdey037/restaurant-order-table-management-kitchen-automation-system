
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

const createOrder = async (req, res) => {
  try {
    const { tableId, items } = req.body;

    if (!tableId) {
      return res.status(400).json({ message: 'Table ID is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const table = await Table.findById(tableId);

    if (!table) {
      return res.status(404).json({ message: 'Selected dining table does not exist' });
    }

    let orderItems = [];
    let subtotal = 0;

    for (let item of items) {
      const { menuItemId, quantity } = item;

      if (!menuItemId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Invalid item format or quantity' });
      }

      const menuItem = await MenuItem.findById(menuItemId);

      if (!menuItem) {
        return res.status(404).json({ message: `Menu item with id ${menuItemId} not found` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Item "${menuItem.name}" is currently unavailable` });
      }

      const price = menuItem.price;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: price,
        quantity: Number(quantity)
      });
    }

    const gst = Number((subtotal * 0.05).toFixed(2));
    const grandTotal = Number((subtotal + gst).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      table: table._id,
      items: orderItems,
      subtotal,
      gst,
      grandTotal,
      status: 'Placed'
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch your orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('table', 'tableNumber capacity');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentStatus = order.status;

    const allowedTransitions = {
      Placed: ['Preparing', 'Cancelled'],
      Preparing: ['Served', 'Cancelled'],
      Served: ['Paid'],
      Paid: [],
      Cancelled: []
    };

    if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from "${currentStatus}" to "${status}".`
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own order' });
    }

    if (order.status !== 'Placed') {
      return res.status(400).json({
        message: `Cannot cancel order with status "${order.status}". Cancellation is only allowed when "Placed".`
      });
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelMyOrder
};
