export interface TaskResponse {
    data: any;  
    dataList: ProjectTask[];
    message: string; 
    statusCode: number;
    success: boolean;
    totalRecords:number;
}

export interface ProjectTask {
    id?: string;
    title?: string;
    dueDate?: Date;
    statusDisplayName?: string;
    status?: number;
    description?: string;
    assignedTranslatorId?: string;
}