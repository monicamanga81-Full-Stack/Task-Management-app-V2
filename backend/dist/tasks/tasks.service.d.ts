import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RedisPublisher } from '../gateway/redis.publisher';
export declare class TasksService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisPublisher);
    getUserTasks(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
    }[]>;
    createTask(dto: CreateTaskDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
    }>;
    syncTasks(tasks: CreateTaskDto[], userId: string): Promise<any[]>;
    updateTask(id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
    }>;
    deleteTask(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
    }>;
}
