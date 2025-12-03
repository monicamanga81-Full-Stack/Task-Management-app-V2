import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPublisher implements OnModuleInit {
  private pub: Redis;
  private sub: Redis;
  private logger = new Logger('RedisPublisher');

  onMessage: (channel: string, message: string) => void = () => {};

  onModuleInit() {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT || 6380);

    this.pub = new Redis(port, host);
    this.sub = new Redis(port, host);

    this.sub.subscribe('task.created', 'task.updated').catch(err => {
      this.logger.error(err);
    });

    this.sub.on('message', (channel, message) => {
      this.onMessage(channel, message);
    });
  }

  publish(channel: string, payload: any) {
    try {
      this.pub.publish(channel, JSON.stringify(payload));
    } catch (err) {
      this.logger.error(err);
    }
  }
}
