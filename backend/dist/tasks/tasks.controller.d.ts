import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    getUserTasks(req: any): Promise<{
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
    createTask(req: any, dto: CreateTaskDto): Promise<{
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
    updateTask(id: string, dto: UpdateTaskDto, req: any): Promise<{
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
    removeTask(id: string, req: any): Promise<{
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
