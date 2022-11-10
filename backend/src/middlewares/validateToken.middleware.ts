import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Firebase from '../configs/firebase';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const token = bearerToken.replace('Bearer ', '');

    if (!token) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    try {
      const decodedUser = await Firebase.auth().verifyIdToken(token);

      if (!decodedUser) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      req.firebaseUser = decodedUser;
      next();
    } catch (err) {
      console.log('ERR WHILE VALIDATING TOKEN: ', err);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
