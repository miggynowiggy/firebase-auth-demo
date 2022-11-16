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
import { CreateExpenseForm, UpdateExpenseForm } from './dto';
import { ExpensesService } from './expenses.service';

@Controller('/api/expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get('/all')
  async getAll(@GetFirebaseUser() fbUser: auth.DecodedIdToken) {
    const response = await this.expensesService.getAll(fbUser.uid);
    return response;
  }

  @Get('/:id')
  async getSingle(@Param('id', ParseIntPipe) id: number) {
    const response = await this.expensesService.findOne(id);
    return response;
  }

  @Post('/new')
  async add(
    @GetFirebaseUser() fbuser: auth.DecodedIdToken,
    @Body() body: CreateExpenseForm,
  ) {
    const response = await this.expensesService.create(fbuser.uid, body);
    return response;
  }

  @Put('/edit')
  async edit(@Body() body: UpdateExpenseForm) {
    const response = await this.expensesService.update(body);
    return response;
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const response = await this.expensesService.remove(id);
    return response;
  }
}
