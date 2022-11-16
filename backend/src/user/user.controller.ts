import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { GetFirebaseUser } from 'src/decorators';
import { CreateUserForm } from './dto';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  async getSelf(@GetFirebaseUser() fbUser: auth.DecodedIdToken) {
    const response = await this.userService.getSelf(fbUser.uid);
    return response;
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserForm) {
    const response = await this.userService.createUser(body);
    return response;
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const response = await this.userService.deleteUser(id);
    return response;
  }
}
