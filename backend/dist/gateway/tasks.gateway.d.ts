import { Server } from 'socket.io';
import { RedisPublisher } from './redis.publisher';
import { OnModuleInit } from '@nestjs/common';
export declare class TasksGateway implements OnModuleInit {
    private redis;
    server: Server;
    constructor(redis: RedisPublisher);
    onModuleInit(): void;
}
