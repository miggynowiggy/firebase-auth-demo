import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';

export const ExpenseTypes = [
  'Bills',
  'Food',
  'Grocery',
  'Transportation',
  'Payment',
  'Fund Transfer',
  'Emergency',
];

export type TExpenseType =
  | 'Bills'
  | 'Food'
  | 'Grocery'
  | 'Transportation'
  | 'Payment'
  | 'Fund Transfer'
  | 'Emergency';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text' })
  public description!: string;

  @Column({ type: 'float' })
  public amount!: number;

  @Column({ type: 'enum', enum: ExpenseTypes })
  public type!: TExpenseType;

  @Column({ type: 'date', default: dayjs().toISOString() })
  public date!: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.Expenses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public User: User;
}
