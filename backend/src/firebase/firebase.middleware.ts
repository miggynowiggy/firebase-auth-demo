import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Scope,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from './firebase.service';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseMiddleware implements NestMiddleware {
  constructor(private readonly firebase: FirebaseService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
      throw new HttpException(
        'Missing authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = bearerToken.replace('Bearer ', '');

    if (!token) {
      throw new HttpException(
        'Missing authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const decodedUser = await this.firebase.auth.verifyIdToken(token);
      req.firebaseUser = decodedUser;
      next();
    } catch (err) {
      console.log('ERR WHILE VALIDATING TOKEN: ', err);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
