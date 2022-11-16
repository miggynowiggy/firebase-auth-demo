import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserForm } from './dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly Users: Repository<User>;

  public async getSelf(uid: string) {
    return this.Users.findOne({
      where: {
        uid,
      },
    });
  }

  public async createUser(body: CreateUserForm) {
    const { fullName, uid, email } = body;

    try {
      const isUserExisting = await this.Users.count({
        where: {
          email,
        },
      });

      if (isUserExisting) {
        throw new HttpException(
          'User is already existing',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newUser: User = new User();
      newUser.fullName = fullName;
      newUser.uid = uid;
      newUser.email = email;

      if (body.profilePicture) {
        newUser.profilePicture = body.profilePicture;
      }

      return this.Users.save(newUser);
    } catch (err) {
      console.log('ERR WHILE CREATING USER: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteUser(id: number) {
    try {
      await this.Users.delete({ id });
    } catch (err) {
      console.log('ERR DELETING A USER: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
