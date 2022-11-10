import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/user/user.entity';
import { CreateTaskForm, UpdateTaskForm } from './dto';

@Injectable()
export class TasksService {
  @InjectRepository(Task)
  private readonly Tasks: Repository<Task>;

  @InjectRepository(User)
  private readonly Users: Repository<User>;

  async getUserTasks(uid: string) {
    try {
      const user = await this.Users.findOne({
        where: {
          uid,
        },
        relations: {
          Tasks: true,
        },
      });

      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      return user.Tasks;
    } catch (err) {
      console.log('ERR WHILE GETTING USER TASKS: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSingleTask(id: number) {
    try {
      const task = await this.Tasks.findOne({
        where: {
          id,
        },
      });
      return task;
    } catch (err) {
      console.log('ERR WHILE GETTING A TASK: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTask(body: CreateTaskForm) {
    try {
      const { content, isDone, userId } = body;

      const user = await this.Users.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const task = new Task();
      task.content = content;
      task.isDone = isDone;
      task.User = user;

      const newTask = await this.Tasks.save(task);
      return newTask;
    } catch (err) {
      console.log('ERR WHILE CREATING TASK: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTask(body: UpdateTaskForm) {
    const { id, ...updatedDetails } = body;
    try {
      let task = await this.Tasks.findOne({
        where: {
          id,
        },
      });

      if (!task) {
        throw new HttpException('task not found', HttpStatus.NOT_FOUND);
      }

      task = {
        ...task,
        ...updatedDetails,
      };

      const updatedTask = await this.Tasks.save(task);
      return updatedTask;
    } catch (err) {
      console.log('ERR WHILE UPDATING TASK: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTask(id: number) {
    try {
      await this.Tasks.softDelete(id);
      return true;
    } catch (err) {
      console.log('ERR WHILE DELETING TASK: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
