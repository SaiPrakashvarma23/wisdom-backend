import Joi from 'joi';

const interactionSchema = Joi.object({
  customer_id: Joi.number().required().messages({
    'number.base': 'Customer ID must be a number.',
    'any.required': 'Customer ID is required.',
  }), // Customer ID is required and must be a number

  user_id: Joi.number().required().messages({
    'number.base': 'User ID must be a number.',
    'any.required': 'User ID is required.',
  }), // User ID is required and must be a number

  notes: Joi.string().max(500).required().messages({
    'string.empty': 'Notes are required.',
    'string.max': 'Notes cannot exceed 500 characters.',
  }), // Notes are required and have a maximum length of 500 characters

  follow_up_date: Joi.date().optional().messages({
    'date.base': 'Follow-up date must be a valid date.',
  }), // Follow-up date is optional and must be a valid date
});

export default interactionSchema;
