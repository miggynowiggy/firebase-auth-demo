import { Controller, Get, Post, Body } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { GetFirebaseUser } from 'src/decorators';
import { CreateUserForm } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getSelf(@GetFirebaseUser() fbUser: auth.DecodedIdToken) {
    const response = await this.userService.getSelf(fbUser.uid);
    return response;
  }

  @Post('new')
  async createUser(@Body() body: CreateUserForm) {
    const response = await this.userService.createUser(body);
    return response;
  }
}
