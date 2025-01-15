const express = require('express');
const Service = require('../models/Service'); // Assuming you have a Service model set up
const { adminMiddleware } = require('../middleware/authMiddleware');  // Import middlewares
const router = express.Router();

// GET - Fetch all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

// POST - Add a new service
router.post('/add', adminMiddleware, async (req, res) => {
  const { serviceName, description, price } = req.body;

  try {
    const newService = new Service({
      serviceName,
      description,
      price,
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully!', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error });
  }
});

// PUT - Update an existing service
router.put('/update/:id', adminMiddleware, async (req, res) => {
  const serviceId = req.params.id;
  const { serviceName, description, price } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { serviceName, description, price},
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service updated successfully!', service: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
});

// DELETE - Delete a service
router.delete('/delete/:id', adminMiddleware, async (req, res) => {
  const serviceId = req.params.id;

  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: 'Service deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
});

module.exports = router;