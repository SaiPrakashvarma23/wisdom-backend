import { Hono } from 'hono';
import { CustomerController } from '../controllers/customerController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const customerController = new CustomerController();
const authMiddleware = new AuthMiddleware();

export const customerRoutes = new Hono();

// Create Customer (Protected)
customerRoutes.post('/', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken,
  customerController.createCustomer.bind(customerController)
);


customerRoutes.get('/', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken,
  customerController.getCustomers.bind(customerController)
);

// Get Customer by ID (Protected)
customerRoutes.get('/:id', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken, 
  customerController.getCustomerById.bind(customerController)
);

// Update Customer (Protected)
customerRoutes.put('/:id', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken, 
  customerController.updateCustomer.bind(customerController)
);

// Delete Customer (Protected)
customerRoutes.delete('/:id', 
  authMiddleware.checkAuthHeader, 
  authMiddleware.validateAccessToken, 
  customerController.deleteCustomer.bind(customerController)
);

// Get Customer Profile (Protected)
// customerRoutes.get('/profile', 
//   authMiddleware.checkAuthHeader,
//   authMiddleware.validateAccessToken,
//   customerController..bind(customerController)
// );



