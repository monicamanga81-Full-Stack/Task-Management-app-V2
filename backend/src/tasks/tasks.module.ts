import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisPublisher } from '../gateway/redis.publisher';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RedisPublisher],
})
export class TasksModule {}
