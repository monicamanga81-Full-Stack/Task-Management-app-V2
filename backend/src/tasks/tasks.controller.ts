import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getUserTasks(@Req() req) {
    return this.taskService.getUserTasks(req.user.userId);
  }

  @Post()
  createTask(@Req() req, @Body() dto: CreateTaskDto) {
    return this.taskService.create(dto, req.user.userId);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  removeTask(@Param('id') id: string, @Req() req) {
    return this.taskService.remove(id, req.user.userId);
  }
}
