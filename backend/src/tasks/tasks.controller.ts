import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getUserTasks(@Req() req) {
    return this.tasksService.getUserTasks(req.user.userId);
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(dto, req.user.userId);
  }

  @Post('sync')
  async syncTasks(@Body() body: { tasks: CreateTaskDto[] }, @Req() req) {
    const tasks = body?.tasks || [];
    return this.tasksService.syncTasks(tasks, req.user.userId);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
