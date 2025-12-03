"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPublisher = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisPublisher = class RedisPublisher {
    constructor() {
        this.logger = new common_1.Logger('RedisPublisher');
        this.onMessage = () => { };
    }
    onModuleInit() {
        const host = process.env.REDIS_HOST || '127.0.0.1';
        const port = Number(process.env.REDIS_PORT || 6380);
        this.pub = new ioredis_1.default(port, host);
        this.sub = new ioredis_1.default(port, host);
        this.sub.subscribe('task.created', 'task.updated').catch(err => {
            this.logger.error(err);
        });
        this.sub.on('message', (channel, message) => {
            this.onMessage(channel, message);
        });
    }
    publish(channel, payload) {
        try {
            this.pub.publish(channel, JSON.stringify(payload));
        }
        catch (err) {
            this.logger.error(err);
        }
    }
};
exports.RedisPublisher = RedisPublisher;
exports.RedisPublisher = RedisPublisher = __decorate([
    (0, common_1.Injectable)()
], RedisPublisher);
//# sourceMappingURL=redis.publisher.js.map