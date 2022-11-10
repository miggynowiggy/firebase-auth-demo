import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text' })
  public content!: string;

  @Column({ type: 'boolean' })
  public isDone!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.Tasks)
  public User: User;
}
