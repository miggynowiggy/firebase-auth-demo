import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ConfirmPasswordResetForm,
  ForgotPasswordForm,
  VerifyEmailForm,
} from './dto';
import Firebase from 'src/configs/firebase';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly Users: Repository<User>;

  async sendForgotPasswordEmail(body: ForgotPasswordForm) {
    try {
      const existingUser = await this.Users.findOne({
        where: {
          email: body.email,
        },
      });

      if (!existingUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      // Insert logic here of sending an email to the supplied email address

      return 'success';
    } catch (err) {
      console.log('ERR IN FORGET PASSWORD: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmPasswordReset(body: ConfirmPasswordResetForm) {
    const { email, password } = body;
    try {
      const existingUser = await this.Users.findOne({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      await Firebase.auth().updateUser(existingUser.uid, {
        password,
      });

      return 'success';
    } catch (err) {
      console.log('ERR WHILE CONFIRMING PASSWORD RESET: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendEmailVerification(body: VerifyEmailForm) {
    const { email } = body;

    try {
      const existingUser = await this.Users.findOne({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      // Insert logic here of sending an email to the supplied email address

      return true;
    } catch (err) {
      console.log('ERR WHILE SENDING EMAIL VERIFICATION: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmEmailVerification(body: VerifyEmailForm) {
    const { email } = body;

    try {
      const existingUser = await this.Users.findOne({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      await Firebase.auth().updateUser(existingUser.uid, {
        emailVerified: true,
      });

      return 'success';
    } catch (err) {
      console.log('ERR WHILE CONFIRMING EMAIL VERIFICATION: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
