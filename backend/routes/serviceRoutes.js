const express = require('express');
const Service = require('../models/Service'); // Assuming you have a Service model set up
const { adminMiddleware } = require('../middleware/authMiddleware'); // Import admin middleware
const { uploadServiceProfile } = require('../middleware/upload'); // Import upload middleware for service pictures
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

// POST - Add a new service with picture upload
router.post('/add', adminMiddleware, uploadServiceProfile, async (req, res) => {
  const { serviceName, description, price } = req.body;
  const servicePicture = req.file ? `/uploads/services/${req.file.filename}` : null;

  try {
    const newService = new Service({
      serviceName,
      servicePicture,
      description,
      price,
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully!', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error });
  }
});

// PUT - Update an existing service with optional picture upload
router.put('/update/:id', adminMiddleware, uploadServiceProfile, async (req, res) => {
  const serviceId = req.params.id;
  const { serviceName, description, price } = req.body;
  const servicePicture = req.file ? `/uploads/services/${req.file.filename}` : null;

  try {
    const updateData = { serviceName, description, price };
    if (servicePicture) {
      updateData.servicePicture = servicePicture;
    }

    const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true });

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
