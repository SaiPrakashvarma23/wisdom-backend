import { Context } from "hono";
import * as bcrypt from 'bcrypt';
import { UserDataServiceProvider } from '../services/userDataServiceProvider'; // Assuming your service provider is set up
import { ResponseHelper } from "../helpers/responseHelper"; // Helper for sending responses
import { ResourceAlreadyExistsException } from "../exceptions/resourseAlreadyExistsException"; // Custom exceptions
import { UnauthorisedException, } from "../exceptions/unauthorisedException";
import { NotFoundException } from "../exceptions/notFounException";
import { getUserAuthTokens } from '../helpers/appHelper';
import { UserService } from "../services/userService";
import userSchema from "../validations/userValidation";
const userDataServiceProvider = new UserDataServiceProvider();

export class UserController {
  // Sign Up for USERs and admins
  private userService = new UserService();
  public async userSignUp(c: Context) {
    try {
      const reqData = await c.req.json();
      const { error } = userSchema.validate(reqData);

      if (error) {
        return c.json({ message: error.details[0].message }, 400); // Return a validation error response
      }
      // Check if the email already exists
      const existedUser = await userDataServiceProvider.findUserByEmail(reqData.email);
      if (existedUser) {
        throw new ResourceAlreadyExistsException("email", "Email already exists.");
      }

      // Default usertype is 'USER'
      reqData.usertype = "USER"; 

      // Create the USER user
      const userData = await userDataServiceProvider.create(reqData);

      const { password, ...userDataWithoutPassword } = userData;

      return ResponseHelper.sendSuccessResponse(c, 200, "USER registered successfully", userDataWithoutPassword);
    } catch (error: any) {
      throw error;
    }
  }

  // Create Admin (admin only)
  public async createAdmin(c: Context) {
    try {
      const reqData = await c.req.json();
   
      // Check if the email already exists
      const existedUser = await userDataServiceProvider.findUserByEmail(reqData.email);
      if (existedUser) {
        throw new ResourceAlreadyExistsException("email", "Email already exists.");
      }

      // Get the logged-in user from context
      const loggedInUser = c.get("user");
      console.log(loggedInUser)
      // Only admins are allowed to create other admins
      if (loggedInUser.usertype !== "ADMIN") {
        throw new UnauthorisedException("Only admins can create new admins.");
      }

      // Set usertype to 'admin'
      reqData.usertype = "ADMIN";

      // Create the new admin user
      const userData = await userDataServiceProvider.create(reqData);

      const { password, ...userDataWithoutPassword } = userData;

      return ResponseHelper.sendSuccessResponse(c, 200, "Admin created successfully", userDataWithoutPassword);
    } catch (error: any) {
      throw error;
    }
  }

  // Sign In for USERs and admins
  public async signIn(c: Context) {
    try {
      const reqData = await c.req.json();
      const userData = await userDataServiceProvider.findUserByEmail(reqData.email);
      
      if (!userData) {
        throw new UnauthorisedException("Invalid credentials.");
      }

      const matchPassword = await bcrypt.compare(reqData.password, userData.password);

      if (!matchPassword) {
        throw new UnauthorisedException("Invalid credentials.");
      }

      const { token, refreshToken } = await getUserAuthTokens(userData);
      const { password, ...userDataWithoutPassword } = userData;

      let response = {
        user_details: userDataWithoutPassword,
        access_token: token,
        refresh_token: refreshToken,
      };

      return ResponseHelper.sendSuccessResponse(c, 200, "User logged in successfully", response);
    } catch (error: any) {
      throw error;
    }
  }

  // Get User Profile (either for admin or USER)
  public async getProfile(c: Context) {
    try {
      const user = c.get("user"); // Get logged-in user from context
      const userData:any = await userDataServiceProvider.findUserById(user.id);

      if (!userData) {
        throw new NotFoundException("User not found.");
      }

      delete userData.password; // Exclude password in response
      return ResponseHelper.sendSuccessResponse(c, 200, "User profile fetched successfully", userData);
    } catch (error) {
      throw error;
    }
  }

  // Update User Account (admins can update any user, USERs can only update their own)
  public async update(c: Context) {
    try {
      const userId :any= +c.req.param("id");
      const reqData = await c.req.json();

      const userData = await userDataServiceProvider.findUserById(userId);

      if (!userData) {
        throw new NotFoundException("User not found.");
      }

      // Check if the logged-in user is an admin or is updating their own profile
      const loggedInUser = c.get("user");
      console.log(loggedInUser)
      if (loggedInUser.id !== userId ) {
        throw new UnauthorisedException("You are not authorized to update this user's details.");
      }

      const emailExist = await userDataServiceProvider.findUserByEmail(reqData.email);
      if (emailExist && emailExist.id !== userId) {
        throw new ResourceAlreadyExistsException("email", "Email already exists.");
      }

      await userDataServiceProvider.updateUserById(reqData, userId);

      return ResponseHelper.sendSuccessResponse(c, 200, "User account updated successfully.");
    } catch (error) {
      throw error;
    }
  }

  // Delete User Account (admins can delete any user, USERs can only delete their own)
  public async delete(c: Context) {
    try {
      const userId:any = +c.req.param("id");
      const userData = await userDataServiceProvider.findUserById(userId);

      if (!userData) {
        throw new NotFoundException("User not found.");
      }

      const loggedInUser = c.get("user");
      if (loggedInUser.id !== userId ) {
        throw new UnauthorisedException("You are not authorized to delete this user's account.");
      }

      await userDataServiceProvider.deleteUserById(userId);

      return ResponseHelper.sendSuccessResponse(c, 200, "User account deleted successfully.");
    } catch (error) {
      throw error;
    }
  }
  async forgotPassword(c: Context) {
    try {
      const { email } = await c.req.json();

      if (!email) {
        return ResponseHelper.sendErrorResponse(c, 400, 'Email is required.');
      }

      await this.userService.sendForgotPasswordOTP(email);;

      return ResponseHelper.sendSuccessResponse(c, 200, 'OTP sent successfully.');
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  async resetPassword(c: Context) {
    try {
      const { email, otp, newPassword } = await c.req.json();

      if (!email || !otp || !newPassword) {
        return ResponseHelper.sendErrorResponse(c, 400, 'Email, OTP, and new password are required.');
      }

      await this.userService.resetPassword(email, otp, newPassword);

      return ResponseHelper.sendSuccessResponse(c, 200, 'Password reset successfully.');
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  // Helper function to generate auth tokens
 }
