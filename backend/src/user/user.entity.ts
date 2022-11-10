import { Task } from 'src/tasks/task.entity';
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

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  // Relationships
  @OneToMany(() => Task, (task) => task.User)
  public Tasks: Task[];
}
