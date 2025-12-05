import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisPublisher } from '../gateway/redis.publisher';
import { SocketGateway } from '../gateway/socket.gateway';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RedisPublisher, SocketGateway],
})
export class TasksModule {}
