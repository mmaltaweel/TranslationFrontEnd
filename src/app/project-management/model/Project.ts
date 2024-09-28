import { ProjectTask } from "./ProjectTask";


export interface ProjectResponse {
    data: any;  
    dataList: Project[];
    message: string; 
    statusCode: number;
    success: boolean;
    totalRecords:number;
}

export interface Project {
    id?: string;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    statusDisplayName?: string;
    status?: number;
    description?: string;
    progress?: number;
    tasks?: ProjectTask[]; 
}
 

