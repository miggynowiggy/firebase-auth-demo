import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskForm {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
