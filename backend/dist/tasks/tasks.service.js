"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const redis_publisher_1 = require("../gateway/redis.publisher");
let TasksService = class TasksService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getUserTasks(userId) {
        return this.prisma.task.findMany({
            where: { createdBy: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTask(dto, userId) {
        const data = {
            title: dto.title,
            description: dto.description,
            status: dto.status ?? client_1.TaskStatus.PENDING,
            dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            createdBy: userId,
        };
        if (dto.id) {
            data.id = dto.id;
        }
        return this.prisma.task.create({ data });
    }
    async syncTasks(tasks, userId) {
        const results = [];
        for (const t of tasks) {
            if (t.id) {
                const upserted = await this.prisma.task.upsert({
                    where: { id: t.id },
                    update: {
                        title: t.title,
                        description: t.description,
                        status: t.status ?? client_1.TaskStatus.PENDING,
                        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
                        updatedAt: new Date(),
                        lastSyncedAt: new Date(),
                    },
                    create: {
                        id: t.id,
                        title: t.title,
                        description: t.description,
                        status: t.status ?? client_1.TaskStatus.PENDING,
                        dueDate: t.dueDate ? new Date(t.dueDate) : null,
                        createdBy: userId,
                        lastSyncedAt: new Date(),
                    },
                });
                try {
                    this.redis.publish('task.created', upserted);
                }
                catch (err) { }
                results.push(upserted);
            }
            else {
                let created = await this.createTask(t, userId);
                try {
                    created = await this.prisma.task.update({ where: { id: created.id }, data: { lastSyncedAt: new Date() } });
                }
                catch (err) { }
                try {
                    this.redis.publish('task.created', created);
                }
                catch (err) { }
                results.push(created);
            }
        }
        return results;
    }
    async updateTask(id, dto) {
        const updated = await this.prisma.task.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                status: dto.status,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
        });
        try {
            this.redis.publish('task.updated', updated);
        }
        catch (err) { }
        return updated;
    }
    async deleteTask(id) {
        const deleted = await this.prisma.task.delete({
            where: { id },
        });
        try {
            this.redis.publish('task.deleted', deleted);
        }
        catch (err) { }
        return deleted;
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, redis_publisher_1.RedisPublisher])
], TasksService);
//# sourceMappingURL=tasks.service.js.map