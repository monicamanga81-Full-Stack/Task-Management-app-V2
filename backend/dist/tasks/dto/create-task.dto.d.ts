import { TaskStatus } from '@prisma/client';
export declare class CreateTaskDto {
    id?: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: Date;
}
