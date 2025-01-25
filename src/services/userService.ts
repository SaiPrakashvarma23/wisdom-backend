import bcrypt from 'bcrypt';
import { OTPService } from './otpService';
import { users } from '../schemas/user';
import { UserDataServiceProvider } from '../services/userDataServiceProvider'
const userDataServiceProvider = new UserDataServiceProvider();
export class UserService {
  private otpService = new OTPService();

  async sendForgotPasswordOTP(email: string): Promise<void> {
    const user = await userDataServiceProvider.findUserByEmail( email);

    if (!user) {
      throw new Error('User with this email does not exist.');
    }

    const otp = this.otpService.generateOTP();
    await this.otpService.sendOTP(email, otp);
    await this.otpService.storeOTP(email, otp);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const isOTPValid = await this.otpService.verifyOTP(email, otp);

    if (!isOTPValid) {
      throw new Error('Invalid or expired OTP.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await userDataServiceProvider.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found.');
      }
    await userDataServiceProvider.updateUserByEmail( {
      password: hashedPassword,
      name: user.name, 
      email: user.email,
      usertype: user.usertype
    },email);
  }
}
