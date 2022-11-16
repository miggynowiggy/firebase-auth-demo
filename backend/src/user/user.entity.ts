import { Expense } from 'src/expenses/expense.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 50 })
  public uid!: string;

  @Column({ type: 'varchar', length: 120 })
  public email!: string;

  @Column({ type: 'varchar', length: 120 })
  public fullName!: string;

  @Column({ type: 'text', nullable: true })
  public profilePicture: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  // Relationships
  @OneToMany(() => Expense, (expense) => expense.User)
  public Expenses: Expense[];
}
