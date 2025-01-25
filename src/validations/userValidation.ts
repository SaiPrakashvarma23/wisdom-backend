// validation/userValidation.ts
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().max(250).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name cannot exceed 100 characters',
  }), // Name is required and max length 256
  mobile_number: Joi.string().length(10).required().messages({
    'string.empty': 'Mobile number is required',
  }), // Mobile number is required and should be exactly 15 characters
  email: Joi.string().email().max(256).required().messages({
    'string.empty': 'Email is required',
    'string.max': 'Email cannot exceed 256 characters',
  }), // Email is required and should be valid
  usertype: Joi.string().valid('admin', 'customer'),
  password: Joi.string().min(6).max(256).required().messages({
    'string.empty': 'password is required',
    'string.max': 'password cannot exceed 256 characters',
  }), // Password is required with a min length of 6
});

export default userSchema;
