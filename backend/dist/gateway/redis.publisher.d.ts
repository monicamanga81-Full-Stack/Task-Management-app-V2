import { OnModuleInit } from '@nestjs/common';
export declare class RedisPublisher implements OnModuleInit {
    private pub;
    private sub;
    private logger;
    onMessage: (channel: string, message: string) => void;
    onModuleInit(): void;
    publish(channel: string, payload: any): void;
}
