// backend/controllers/serviceController.js
const Service = require('../models/Service');

// Controller to list all services
const listServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Controller to create a new service
const createService = async (req, res) => {
    const { serviceType, description, price } = req.body;

    try {
        const newService = new Service({
            serviceType,
            description,
            price,
        });
        await newService.save();
        res.status(201).json({ message: 'Service created successfully', newService });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { listServices, createService };
