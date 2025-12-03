import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  title: string;
  description?: string;
  status?: string;
  dueDate?: Date;
}
