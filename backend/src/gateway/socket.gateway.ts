import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RedisPublisher } from './redis.publisher';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('SocketGateway');

  constructor(private redis: RedisPublisher) {}

  onModuleInit() {
    // Hook RedisPublisher messages to forward to WebSocket clients
    this.redis.onMessage = (channel: string, message: string) => {
      try {
        const payload = JSON.parse(message);
        this.logger.log(`Forwarding ${channel} to websocket clients`);
        this.server?.emit(channel, payload);
      } catch (err) {
        this.logger.warn('Invalid redis message', err?.message || err);
      }
    };
  }
}
