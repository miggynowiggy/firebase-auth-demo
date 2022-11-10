import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmPasswordResetForm,
  ForgotPasswordForm,
  VerifyEmailForm,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-forgot-password')
  async sendForgotPassword(@Body() body: ForgotPasswordForm) {
    const response = await this.authService.sendForgotPasswordEmail(body);
    return response;
  }

  @Post('send-verify-email')
  async sendVerifyEmail(@Body() body: VerifyEmailForm) {
    const response = await this.authService.sendEmailVerification(body);
    return response;
  }

  @Post('confirm-password-reset')
  async confirmPasswordReset(@Body() body: ConfirmPasswordResetForm) {
    const response = await this.authService.confirmPasswordReset(body);
    return response;
  }

  @Post('confirm-verify-email')
  async verifyEmail(@Body() body: VerifyEmailForm) {
    const response = await this.authService.confirmEmailVerification(body);
    return response;
  }
}
