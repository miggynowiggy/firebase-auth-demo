import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, TExpenseType } from './expense.entity';
import { User } from 'src/user/user.entity';
import { CreateExpenseForm, UpdateExpenseForm } from './dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly Expenses: Repository<Expense>,

    @InjectRepository(User)
    private readonly Users: Repository<User>,
  ) {}

  async getAll(uid: string) {
    try {
      const user = await this.Users.findOne({
        where: {
          uid,
        },
        relations: {
          Expenses: true,
        },
      });

      return user ? user.Expenses : null;
    } catch (err) {
      console.log('ERR WHILE GETTING USER EXPENSE: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      const expense = await this.Expenses.findOne({
        where: {
          id,
        },
      });
      return expense;
    } catch (err) {
      console.log('ERR WHILE GETTING A EXPENSE: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(uid: string, body: CreateExpenseForm) {
    try {
      const { description, amount, type, date } = body;

      const user = await this.Users.findOne({
        where: {
          uid,
        },
      });

      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const expense = new Expense();
      expense.description = description;
      expense.amount = amount;
      expense.date = date;
      expense.type = type as TExpenseType;
      expense.User = user;

      const newEXPENSE = await this.Expenses.save(expense);
      return newEXPENSE;
    } catch (err) {
      console.log('ERR WHILE CREATING EXPENSE: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(body: UpdateExpenseForm) {
    const { id, ...updatedDetails } = body;
    try {
      let expense = await this.Expenses.findOne({
        where: {
          id,
        },
      });

      if (!expense) {
        throw new HttpException('not found', HttpStatus.NOT_FOUND);
      }

      expense = {
        ...expense,
        ...updatedDetails,
      };

      const updatedExpense = await this.Expenses.save(expense);
      return updatedExpense;
    } catch (err) {
      console.log('ERR WHILE UPDATING EXPENSE: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      await this.Expenses.delete(id);
      return true;
    } catch (err) {
      console.log('ERR WHILE DELETING EXPENSE: ', err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
