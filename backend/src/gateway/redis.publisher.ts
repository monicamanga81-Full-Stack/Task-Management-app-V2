import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPublisher implements OnModuleInit {
  private pub: Redis;
  private sub: Redis;
  private logger = new Logger('RedisPublisher');

  onMessage: (channel: string, message: string) => void = () => {};

  onModuleInit() {
    // Only enable Redis if REDIS_HOST is explicitly provided.
    // This prevents accidental connection attempts in local dev where Redis isn't running.
    const host = process.env.REDIS_HOST;
    if (!host) {
      this.logger.warn('Redis publisher disabled (no REDIS_HOST)');
      return;
    }
    const port = Number(process.env.REDIS_PORT || 6380);

    this.pub = new Redis(port, host);
    this.sub = new Redis(port, host);

    // prevent unhandled "error" events from crashing the process
    this.pub.on('error', (err) => {
      this.logger.warn('Redis pub error', err?.message || err);
    });
    this.sub.on('error', (err) => {
      this.logger.warn('Redis sub error', err?.message || err);
    });

    this.sub.subscribe('task.created', 'task.updated', 'task.deleted').catch(err => {
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
