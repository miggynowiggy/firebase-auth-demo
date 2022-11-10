import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class ConfirmPasswordResetForm {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(8)
  password: string;
}
