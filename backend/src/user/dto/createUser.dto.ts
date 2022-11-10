import { IsAlpha, IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserForm {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  uid: string;

  @IsNotEmpty()
  @IsAlpha()
  fullName: string;
}
