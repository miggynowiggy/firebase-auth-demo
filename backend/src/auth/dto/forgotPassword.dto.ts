import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordForm {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
