const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');  // Import middlewares

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const {  userId, serviceId, flatId, carType, pickup, dropoff, journeyType, date, time, distance, duration, fare, address } = req.body;

    // Check if the user has provided required fields like userId and address
    if (!userId) {
      return res.status(400).json({ message: 'Missing required field (userId)' });
    }

    let newOrder;

    // If serviceId is provided, it's a service booking
    if (serviceId) {
      // Ensure required fields for service booking are provided
      newOrder = new Order({
        serviceId,
        userId,
        address,
        type: 'service', // For service bookings
      });

    } else if (flatId) {

      newOrder = new Order({
        flatId,
        userId,
        type: 'flat', // For flat bookings
      });

    } else if (carType) {
      // If carType is provided, it's a car booking
      if (!pickup || !dropoff || !journeyType || !carType || !distance || !duration || !fare || !date || !time ) {
        return res.status(400).json({ message: 'Missing required fields for car booking' });
      }

      newOrder = new Order({
        pickup,
        dropoff,
        journeyType,
        carType,
        distance,
        duration,
        fare,
        date,
        time,
        userId,
        type: 'car', // For car bookings
      });
    } else {
      return res.status(400).json({ message: 'Missing booking type (service, flat, or car)' });
    }

    // Save the new order to the database
    await newOrder.save();

    // Return success message
    return res.status(201).json({ message: 'Order placed successfully', order: newOrder });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error while placing the order' });
  }
});

// Get all orders (Admin functionality)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('serviceId userId flatId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get orders for a specific user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await Order.find({ userId }).populate('serviceId userId flatId').sort({ createdAt: -1 });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status (Admin can update their order)
router.patch('/update/:orderId', adminMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete an order
router.delete('/delete/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;