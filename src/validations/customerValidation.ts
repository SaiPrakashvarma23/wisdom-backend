// validation/customerValidation.ts
import Joi from 'joi';

// Define the customer schema validation
const customerSchema = Joi.object({
  name: Joi.string().max(256).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name cannot exceed 256 characters',
  }), // Name is required with a max length of 256

  email: Joi.string().email().max(256).required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'string.max': 'Email cannot exceed 256 characters',
  }), // Email is required and must be valid with a max length of 256

  phone: Joi.string().max(15).required().pattern(/^\+?\d{1,20}$/).messages({
    'string.empty': 'Phone number is required',
    'string.max': 'Phone number cannot exceed 20 characters',
    'string.pattern.base': 'Phone number must contain only digits and may include a leading "+"',
  }), // Phone is required, max length 20, with optional "+" at the start

  company: Joi.string().max(256).allow(null, '').messages({
    'string.max': 'Company name cannot exceed 256 characters',
  }), // Company name is optional, max length 256

  user_id: Joi.number().integer().messages({
    'number.base': 'User ID must be a valid number',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }), // User ID is required and must be a positive integer
});

export default customerSchema;
