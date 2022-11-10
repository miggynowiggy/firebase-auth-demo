import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailForm {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
