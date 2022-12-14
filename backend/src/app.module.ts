import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { UserModule } from './user/user.module';
import { TasksModule } from './expenses/expenses.module';
import { AppController } from './app.controller';

import { UserController } from './user/user.controller';
import { ExpensesController } from './expenses/expenses.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseMiddleware } from './firebase/firebase.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    TasksModule,
    FirebaseModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .forRoutes(UserController, ExpensesController);
  }
}
