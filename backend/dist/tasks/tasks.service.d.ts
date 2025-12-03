import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserTasks(userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date | null;
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: CreateTaskDto, userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date | null;
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateTaskDto, userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date | null;
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: string;
        dueDate: Date | null;
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
