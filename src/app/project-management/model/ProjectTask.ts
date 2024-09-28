export interface ProjectTask {
    id?: string;
    title?: string;
    dueDate?: Date;
    statusDisplayName?: string;
    status?: number;
    description?: string;
    assignedTranslatorId: string;
}