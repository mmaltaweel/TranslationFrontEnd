export interface ReportFilterDto {
    projectId?: string |undefined;
    translatorId?: string|undefined;
    taskDueDate?: Date|undefined;
    startDate?: Date|undefined;
    endDate?: Date|undefined;
  }
  
  export interface ChartDataDto {
    labels: string[];
    data: number[];
  }
  