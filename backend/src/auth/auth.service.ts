import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ConfirmPasswordResetForm,
  ForgotPasswordForm,
  VerifyEmailForm,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly Users: Repository<User>,
    private readonly firebase: FirebaseService,
  ) {}

  async getUserByEmail(email: string) {
    try {
      const user = this.Users.findOne({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      console.log('ERR WHILE GETTING USER BY EMAIL: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

      await this.firebase.auth.updateUser(existingUser.uid, {
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

      await this.firebase.auth.updateUser(existingUser.uid, {
        emailVerified: true,
      });

      return 'success';
    } catch (err) {
      console.log('ERR WHILE CONFIRMING EMAIL VERIFICATION: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
