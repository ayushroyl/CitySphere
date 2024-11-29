// backend/utils/validators.js
const validator = require('validator');

const validateEmail = (email) => validator.isEmail(email);

const validateServiceInput = (data) => {
    const errors = {};

    if (!data.serviceType || data.serviceType.trim() === '') {
        errors.serviceType = 'Service type is required';
    }
    if (!data.description || data.description.trim() === '') {
        errors.description = 'Description is required';
    }
    if (!data.price || typeof data.price !== 'number') {
        errors.price = 'Price must be a number';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

module.exports = { validateEmail, validateServiceInput };
