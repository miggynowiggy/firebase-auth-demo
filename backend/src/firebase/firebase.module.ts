import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseMiddleware } from './firebase.middleware';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [ConfigService, FirebaseService, FirebaseMiddleware],
  exports: [FirebaseService, FirebaseMiddleware],
})
export class FirebaseModule {}
