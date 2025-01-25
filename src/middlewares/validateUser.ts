import { Context } from 'hono';
import userSchema from '../validations/userValidation';

// Middleware function to validate user data
export const validateUser = async (c: Context, next: () => Promise<Response>): Promise<Response> => {
  const { error } = userSchema.validate(await c.req.json());
  
  if (error) {
    // Return validation error if present
    return c.json({ message: error.details[0].message }, 400);
  }

  // Ensure `next()` always returns a Response, resolving to a valid response
  return await next(); // This should return a valid Response from next middleware
};
