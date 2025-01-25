import { Context } from "hono";
import { CustomerServiceProvider } from "../services/customerServiceProvider";
import { ResponseHelper } from "../helpers/responseHelper";
import { NotFoundException } from "../exceptions/notFounException";
import { UserDataServiceProvider } from '../services/userDataServiceProvider';
import { UnauthorisedException } from "../exceptions/unauthorisedException";
import { buildFilters } from '../helpers/filterHelper';
import { dynamicSort } from "../helpers/sortHelper";
import paginationHelper from "../helpers/paginationHelper";
import { mapCustomerResponse } from "../helpers/customerResponseHelper";
import customerSchema from "../validations/customerValidation";
const customerService = new CustomerServiceProvider();
const userDataServiceProvider = new UserDataServiceProvider();
export class CustomerController {
  // Create customer
  async createCustomer(c: Context) {
    try {
      const user = c.get("user"); // Get logged-in user from context
      const userData:any = await userDataServiceProvider.findUserById(user.id);
      if (!userData) {
        throw new NotFoundException("User not found.");
      }
      const loggedInUser=userData.id;
      const reqData = await c.req.json();
      //validation
      const { error } = customerSchema.validate(reqData);

      if (error) {
        return c.json({ message: error.details[0].message }, 400); // Return a validation error response
      }
      const customerData = { ...reqData, user_id: loggedInUser };

      const newCustomer = await customerService.create(customerData);
      return ResponseHelper.sendSuccessResponse(c, 201, "Customer created successfully", newCustomer);
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  // Get customer by ID
  async getCustomerById(c: Context) {
    try {
      const customerId = +c.req.param("id");
      const customer = await customerService.findCustomerById(customerId);

      if (!customer) {
        throw new NotFoundException("Customer not found.");
      }

      return ResponseHelper.sendSuccessResponse(c, 200, "Customer retrieved successfully", customer);
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }



  public async getCustomers(c: Context) {
    try {
      const query = c.req.query();
      const page: number = parseInt(query.page || '1', 10);
      const limit: number = parseInt(query.limit || '10', 10);
      const skip: number = (page - 1) * limit;
  
      // Sorting options
      const sort = dynamicSort(query.sort_by || 'created_at', query.sort_type || 'desc');
  
      // Get the logged-in user details (admin or customer)
      const loggedInUser = c.get("user");
      console.log('LOGGEDIN_USER', loggedInUser);
      // Allowed filters that are expected in the query
      const allowedFilters = ['status']; // Example: add status or other fields for filtering
  
      // Use filter helper to create filter condition based on query parameters
      let filters = buildFilters(query, allowedFilters);
  
      // If logged-in user is not an admin, filter by their own ID only
      if (loggedInUser.usertype !== 'ADMIN') {
        filters += filters.length > 0 ? ' AND ' : '';
        filters += `user_id = ${loggedInUser.id}`;
      }
  
      // Get the list of customers based on filters, pagination, and sorting
      const [customers, totalCount] = await Promise.all([
        customerService.findAll({ offset: skip, limit, filters, sort }),
        customerService.getCount(filters),
      ]);
  
      // Process the customers if needed
      const updatedCustomers: any = await Promise.all(
        customers.map(async (customer) => await mapCustomerResponse(customer))
      );
  
      // Prepare the pagination response
      const result = await paginationHelper.getPaginationResponse({
        page,
        count: totalCount,
        limit,
        skip,
        data: updatedCustomers,
        message: 'CUSTOMERS_FETCHED',
        searchString: query.search_string || ''
      });
  
      return c.json(result);
    } catch (error: any) {
      console.error('ERROR_FETCHING_CUSTOMERS', error);
      throw error;
    }
  }
  

  // Update customer
  public async updateCustomer(c: Context) {
    try {
      const customerId: any = +c.req.param("id"); // Get user ID from URL parameters
      const reqData = await c.req.json(); // Get the request data from the body
  
      // Find the user in the database by ID
      const customerData = await customerService.findCustomerById(customerId);
      if (!customerData) {
        throw new NotFoundException("customer not found.");
      }
  
      // Get the logged-in user's details from the request context (authentication token)
      const loggedInUser = c.get("user");
  
      // Check if the logged-in user is trying to update their own profile
      if (loggedInUser.id !== customerData.user_id) {
        throw new UnauthorisedException("You are not authorized to update this user's details.");
      }
      // Proceed with the update if all checks pass
      await customerService.updateCustomerById(reqData, customerId);
  
      return ResponseHelper.sendSuccessResponse(c, 200, "User account updated successfully.");
    } catch (error) {
      throw error;
    }
  }
  

  public async deleteCustomer(c: Context) {
    try {
      const customerId: any = +c.req.param("id"); // Get customer ID from URL parameters
  
      // Find the customer in the database by ID
      const customerData = await customerService.findCustomerById(customerId);
      if (!customerData) {
        throw new NotFoundException("Customer not found.");
      }
  
      // Get the logged-in user's details from the request context (authentication token)
      const loggedInUser = c.get("user");
  
      // Check if the logged-in user is authorized to delete the customer
      if (loggedInUser.id !== customerData.user_id) {
        throw new UnauthorisedException("You are not authorized to delete this customer's details.");
      }
  
      // Proceed with the deletion if all checks pass
      await customerService.deleteCustomerById(customerId);
  
      return ResponseHelper.sendSuccessResponse(c, 200, "Customer account deleted successfully.");
    } catch (error) {
      throw error;
    }
  }
  
}

