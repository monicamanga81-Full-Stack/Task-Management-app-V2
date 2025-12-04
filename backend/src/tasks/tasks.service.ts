import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';
import { RedisPublisher } from '../gateway/redis.publisher';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService, private redis: RedisPublisher) {}

  async getUserTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTask(dto: CreateTaskDto, userId: string) {
    const data: any = {
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.PENDING,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      createdBy: userId,
    };

    if (dto.id) {
      data.id = dto.id;
    }
    const created = await this.prisma.task.create({ data });

    try {
      if (userId) {
        await this.prisma.auditLog.create({
          data: {
            action: 'TASK_CREATED',
            entity: 'Task',
            entityId: created.id,
            details: { title: created.title, status: created.status, dueDate: created.dueDate },
            user: { connect: { id: userId } },
          },
        });
      }
    } catch (err) {}

    return created;
  }

  async syncTasks(tasks: CreateTaskDto[], userId: string) {
    const results: any[] = [];
    for (const t of tasks) {
      // If the client provided an id, use upsert to make sync idempotent
      if (t.id) {
        const upserted = await this.prisma.task.upsert({
          where: { id: t.id },
          update: {
            title: t.title,
            description: t.description,
            status: t.status ?? TaskStatus.PENDING,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            updatedAt: new Date(),
            lastSyncedAt: new Date(),
          },
          create: {
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status ?? TaskStatus.PENDING,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            createdBy: userId,
            lastSyncedAt: new Date(),
          },
        });

        try {
          this.redis.publish('task.created', upserted);
        } catch (err) {}

        try {
          if (userId) {
            await this.prisma.auditLog.create({
              data: {
                action: 'TASK_SYNCED',
                entity: 'Task',
                entityId: upserted.id,
                details: { fromClient: true, payload: JSON.parse(JSON.stringify(t)), createdAt: upserted.createdAt, updatedAt: upserted.updatedAt },
                user: { connect: { id: userId } },
              },
            });
          }
        } catch (err) {}

        results.push(upserted);
      } else {
        let created = await this.createTask(t, userId);
        // update lastSyncedAt for created records when syncing without client id
        try {
          created = await this.prisma.task.update({ where: { id: created.id }, data: { lastSyncedAt: new Date() } });
        } catch (err) {}

        try {
          this.redis.publish('task.created', created);
        } catch (err) {}

        try {
          if (userId) {
            await this.prisma.auditLog.create({
              data: {
                action: 'TASK_SYNCED',
                entity: 'Task',
                entityId: created.id,
                details: { fromClient: false, payload: JSON.parse(JSON.stringify(t)), createdAt: created.createdAt },
                user: { connect: { id: userId } },
              },
            });
          }
        } catch (err) {}

        results.push(created);
      }
    }

    return results;
  }

  async updateTask(id: string, dto: UpdateTaskDto, userId?: string) {
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
    } catch (err) {}

    try {
      if (userId) {
        await this.prisma.auditLog.create({
          data: {
            action: 'TASK_UPDATED',
            entity: 'Task',
            entityId: updated.id,
            details: { title: updated.title, status: updated.status, dueDate: updated.dueDate },
            user: { connect: { id: userId } },
          },
        });
      }
    } catch (err) {}

    return updated;
  }

  async deleteTask(id: string, userId?: string) {
    const deleted = await this.prisma.task.delete({
      where: { id },
    });

    try {
      this.redis.publish('task.deleted', deleted);
    } catch (err) {}

    try {
      if (userId) {
        await this.prisma.auditLog.create({
          data: {
            action: 'TASK_DELETED',
            entity: 'Task',
            entityId: deleted.id,
            details: { title: deleted.title, status: deleted.status, deletedAt: deleted.updatedAt ?? new Date() },
            user: { connect: { id: userId } },
          },
        });
      }
    } catch (err) {}

    return deleted;
  }
}
