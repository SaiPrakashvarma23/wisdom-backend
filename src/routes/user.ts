import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

export const userRoutes = new Hono();

// Customer Sign Up Route with Validation Middleware
userRoutes.post('/signup', // This middleware will validate the user data before reaching the controller
  userController.userSignUp.bind(userController)
);

// Admin Sign Up Route (Create Admin)
userRoutes.post('/create-admin', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken,
  userController.createAdmin.bind(userController)
);

// Sign In Route
userRoutes.post('/signin', userController.signIn.bind(userController));

// Get User by ID Route
userRoutes.get('/:id', userController.getProfile.bind(userController));

// Update User Route (Protected)
userRoutes.patch('/:id', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken, 
  userController.update.bind(userController)
);

// Delete User Route (Protected)
userRoutes.delete('/:id', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken, 
  userController.delete.bind(userController)
);

// Get User Profile (Protected)
userRoutes.get('/profile', 
  authMiddleware.checkAuthHeader,
  authMiddleware.validateAccessToken,
  userController.getProfile.bind(userController)
);

userRoutes.post('/forgot-password', userController.forgotPassword.bind(userController));
userRoutes.post('/reset-password', userController.resetPassword.bind(userController));
