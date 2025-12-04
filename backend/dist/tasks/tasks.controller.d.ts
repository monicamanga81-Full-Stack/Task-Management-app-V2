import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    getUserTasks(req: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createTask(dto: CreateTaskDto, req: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    syncTasks(body: {
        tasks: CreateTaskDto[];
    }, req: any): Promise<any[]>;
    updateTask(id: string, dto: UpdateTaskDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTask(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.TaskStatus;
        dueDate: Date | null;
        createdBy: string;
        isDeleted: boolean;
        version: number;
        lastSyncedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
