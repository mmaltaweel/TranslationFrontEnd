import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ProjectTask, TaskResponse } from '../project-management/model/ProjectTask';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskService } from './service/TaskService';
import { TableLazyLoadEvent } from 'primeng/table';
import { Project } from '../project-management/model/Project';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css',
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
  ]
})
export class TaskManagementComponent {
  totalRecords: number = 0;
  rows: number = 5;
  loading: boolean = false;
  taskDialog: boolean = false;
  tasks: ProjectTask[] = [];
  task: ProjectTask = {};
  constructor(private taskService: TaskService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  ngOnInit() {

  }
  refreshGrid() {
    this.getTasks({ first: 0, rows: this.rows });
  }
  hideDialog() {
    this.taskDialog = false;
  }
  getTasks(event: TableLazyLoadEvent): void {
    this.loading = true;
    const skip = event.first || 0;
    const take = event.rows || this.rows;

    this.taskService.getTasks(skip, take).subscribe(
      (data: TaskResponse) => {
        this.tasks = data.dataList;
        this.totalRecords = data.totalRecords;
        this.tasks.forEach(task => {
          if (task.dueDate) {
            task.dueDate = new Date(task.dueDate);
          }
        });
        this.loading = false;
      },
      error => {
        console.error('Error fetching tasks:', error);
        this.loading = false;
      }
    );
  }
  getSeverity(status: string) {
    if (!status) {
      return 'success';
    }
    switch (status.toLowerCase()) {
      case 'overdue':
        return 'danger';

      case 'completed':
        return 'success';

      case 'inprogress':
        return 'info';
    }
    return 'success';
  }

  markTaskAsCompleted(task: ProjectTask) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this task ' + task.title + ' as completed' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taskService.markTaskAsCompleted(task.id).subscribe(
          () => {
            this.refreshGrid();
            this.loading = false;
          },
          error => {
            console.error('Error fetching tasks:', error);
            this.loading = false;
          }
        );
        this.tasks = this.tasks.filter(val => val.id !== task.id);
        this.task = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Completed', life: 3000 });
      }
    });
  }
}
