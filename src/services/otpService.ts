import nodemailer from 'nodemailer';

const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

export class OTPService {
  private transporter: nodemailer.Transporter;
  private otpStorage: Map<string, { otp: string; expiresAt: number }>;

  constructor() {
    // Initialize the OTP transporter (using Gmail SMTP settings)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // SMTP host for Gmail
      port: 587, // Port for TLS
      secure: false, // Use true for port 465 (SSL)
      auth: {
        user: 'saraswathi2747@gmail.com', // Your Gmail address
        pass: 'ojwk emwb ycms tfaj', // Your Gmail App Password (generate from your Google Account)
      },
    });

    this.otpStorage = new Map<string, { otp: string; expiresAt: number }>(); // In-memory OTP storage
  }

  // Method to generate a 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP
  }

  // Method to send OTP to the given email
  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: 'saraswathi2747@gmail.com', // Sender's email address (should be the same as the "auth.user")
      to: email, // Recipient's email
      subject: 'Password Reset OTP', // Subject of the email
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`, // Email body
    };

    // Send the email with OTP
    await this.transporter.sendMail(mailOptions);
  }

  // Method to store OTP with an expiration time of 5 minutes
  async storeOTP(email: string, otp: string): Promise<void> {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration time
    this.otpStorage.set(email, { otp, expiresAt }); // Store OTP and its expiration time in memory
  }

  // Method to verify the OTP for the given email
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedData = this.otpStorage.get(email); // Retrieve stored OTP data

    if (!storedData) return false; // No OTP found for the email

    const { otp: storedOTP, expiresAt } = storedData;

    if (Date.now() > expiresAt) {
      this.otpStorage.delete(email); // OTP expired, delete it from storage
      return false; // OTP is expired
    }

    if (otp !== storedOTP) return false; // OTP doesn't match

    this.otpStorage.delete(email); // OTP verified successfully, delete it from storage
    return true; // OTP is valid
  }
}

