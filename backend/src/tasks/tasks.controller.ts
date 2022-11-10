import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { GetFirebaseUser } from 'src/decorators';
import { CreateTaskForm, UpdateTaskForm } from './dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get('all')
  async getUsersTasks(@GetFirebaseUser() fbUser: auth.DecodedIdToken) {
    const response = await this.taskService.getUserTasks(fbUser.uid);
    return response;
  }

  @Get(':id')
  async getSingleTask(@Param('id', ParseIntPipe) id: number) {
    const response = await this.taskService.getSingleTask(id);
    return response;
  }

  @Post('new')
  async createTask(@Body() body: CreateTaskForm) {
    const response = await this.taskService.createTask(body);
    return response;
  }

  @Put('edit')
  async updateTask(@Body() body: UpdateTaskForm) {
    const response = await this.taskService.updateTask(body);
    return response;
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    const response = await this.taskService.deleteTask(id);
    return response;
  }
}
