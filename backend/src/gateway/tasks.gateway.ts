import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisPublisher } from './redis.publisher';
import { Injectable, OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class TasksGateway implements OnModuleInit {
  @WebSocketServer() server: Server;

  constructor(private redis: RedisPublisher) {}

  onModuleInit() {
    this.redis.onMessage = (channel: string, message: string) => {
      this.server.emit(channel.replace('.', ':'), JSON.parse(message));
    };
  }
}
