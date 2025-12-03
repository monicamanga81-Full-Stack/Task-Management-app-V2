import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: Date;
}
