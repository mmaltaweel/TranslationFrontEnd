import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Project, ProjectResponse } from './model/Project';
import { ProjectTask } from './model/ProjectTask';
import { ProjectService } from './service/ProjectService';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TableLazyLoadEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TaskService } from '../task-management/service/TaskService';
import { AuthService } from '../login/service/AuthService';
import { UserDto } from '../login/model/User';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.css',
  providers: [],
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
export class ProjectManagementComponent implements OnInit {
  expandedRows = {};
  totalRecords: number = 0;
  rows: number = 5;
  loading: boolean = false;
  projectDialog: boolean = false;
  projects: Project[] = [];
  project: Project = {};

  taskDialog: boolean = false;
  tasks: ProjectTask[] = [];
  task: ProjectTask = {};
  
  translators: UserDto[] = [];
  
  submitted: boolean = false;

  constructor(private authService:AuthService,private taskService:TaskService,private projectService: ProjectService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.fetchUsers();
  }
  refreshGrid(){
    this.getProjects({ first: 0, rows: this.rows });
  }
  getProjects(event: TableLazyLoadEvent): void {
    this.loading = true;
    const skip = event.first || 0;
    const take = event.rows || this.rows;

    this.projectService.getProjects(skip, take).subscribe(
      (data: ProjectResponse) => {
        this.projects = data.dataList;
        this.totalRecords = data.totalRecords;
        this.projects.forEach(project => {
          if (project.startDate) {
            project.startDate = new Date(project.startDate);
          }
          if (project.endDate) {
            project.endDate = new Date(project.endDate);
          }
          project.tasks?.forEach(task =>{
            if (task.dueDate) {
              task.dueDate=new Date(task.dueDate);
            }
          })
        });
        this.loading = false;
      },
      error => {
        console.error('Error fetching projects:', error);
        this.loading = false;
      }
    );
  }
  openNew() {
    this.project = {};
    this.submitted = false;
    this.projectDialog = true;
  }
  openNewTask(){
    this.task = {};
    this.submitted = false;
    this.taskDialog = true;
  }
  editProject(project: Project) {
    this.project = { ...project };
    this.projectDialog = true;
  }
  editTask(task: ProjectTask) {
    this.task = { ...task };
    this.taskDialog = true;
  }
  deleteProject(project: Project) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + project.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projectService.deleteProject(project.id).subscribe(
          () => {
            this.refreshGrid();
            this.loading = false;
          },
          error => {
            console.error('Error fetching projects:', error);
            this.loading = false;
          }
        );
        this.projects = this.projects.filter(val => val.id !== project.id);
        this.project = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
      }
    });
  }
  deleteTask(task: ProjectTask) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + task.title + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taskService.deleteTask(task.id,this.project.id).subscribe(
          () => {
            this.refreshGrid();
            this.loading = false;
          },
          error => {
            console.error('Error fetching projects:', error);
            this.loading = false;
          }
        );
        this.tasks = this.tasks.filter(val => val.id !== task.id);
        this.task = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Deleted', life: 3000 });
      }
    });
  }
  markProjectAsCompleted(project: Project) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this project ' + project.name + ' as completed (all tasks will be marked compeleted as well) ' + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projectService.markProjectAsCompleted(project.id).subscribe(
          () => {
            this.refreshGrid();
            this.loading = false;
          },
          error => {
            console.error('Error fetching projects:', error);
            this.loading = false;
          }
        );
        this.projects = this.projects.filter(val => val.id !== project.id);
        this.project = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Completed', life: 3000 });
      }
    });
  }
  hideDialog() {
    this.projectDialog = false;
    this.taskDialog=false;
    this.submitted = false;
  }
  validateProjectForm(): boolean {
    return (
      this.isStringInvalid(this.project.name) ||
      this.isStringInvalid(this.project.description) ||
      !this.isValidDate(this.project.startDate) ||
      !this.isValidDate(this.project.endDate) ||
      this.isEndDateLessThanStart(this.project.startDate,this.project.endDate)
    );
  }
  validateTaskForm(): boolean {
    return (
      this.isStringInvalid(this.task.title) ||
      this.isStringInvalid(this.task.description) ||
      !this.isValidDate(this.task.dueDate) ||
      this.isStringInvalid(this.task.assignedTranslatorId)
    );
  }
  isEndDateLessThanStart(startDate: Date | undefined, endDate: Date | undefined): boolean {
    if (!startDate || !endDate) {
        return false;
    }
    return endDate < startDate;
}

  saveProject() {
    this.submitted = true;
    if (!this.project || this.validateProjectForm()) {
      return;
    }
    if (this.project.name && this.project.name.trim()==="") {
      return ;
     }

    if (this.project.id) {
      this.projects[this.findIndexById(this.project.id)] = this.project;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'project Updated', life: 3000 });
      this.projectService.updateProject(this.project).subscribe(
        response => {
          console.log('Project created successfully:', response);
          this.refreshGrid();
        },
        error => {
          console.error('Error creating project:', error);
        }
      );
    }
    else {
      this.project.id = this.createId();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'project Created', life: 3000 });
      this.projectService.createProject(this.project).subscribe(
        response => {
          console.log('Project created successfully:', response);
          this.refreshGrid();
        },
        error => {
          console.error('Error creating project:', error);
        }
      );
    }
    this.projectDialog = false;
    this.project = {};
  }

  saveTask() {
    this.submitted = true;
    if (!this.task || this.validateTaskForm()) {
      return;
    }
    if (this.task.title && this.task.title.trim()==="") {
      return ;
     }
    if (this.task.id) {
      this.tasks[this.findIndexById(this.task.id)] = this.task;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'task Updated', life: 3000 });
      this.taskService.updateTask(this.project.id,this.task).subscribe(
        response => {
          console.log('Task Updated successfully:', response);
          this.getProjects({ first: 0, rows: this.rows });
        },
        error => {
          console.error('Error creating project:', error);
        }
      );
    }
    else {
      this.task.id = this.createId();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'task Created', life: 3000 });
      this.taskService.createTask(this.project.id,this.task).subscribe(
        response => {
          console.log('Task created successfully:', response);
          this.getProjects({ first: 0, rows: this.rows });
        },
        error => {
          console.error('Error creating task:', error);
        }
      );
    }
    this.taskDialog = false;
    this.task = {};
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
  onRowExpand(event: TableRowExpandEvent) {
    this.project.id=event.data.id;
   }

  onRowCollapse(event: TableRowCollapseEvent) {
   }
  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
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
  isStringInvalid(value: string | null | undefined): boolean {
    return !value || value.trim() === '';
  }
  isValidDate(value: Date | undefined): boolean {
    if (!value) {
      return false;
    }
    const date = new Date(value);
    const isValid = !isNaN(date.getTime());
    const isRealistic = date.getFullYear() > 1900;
    return isValid && isRealistic;
  }
  fetchUsers() {
    this.authService.fetchUsers().subscribe(
      (data) => {
        this.translators = data;
        console.log('Fetched users:', this.translators);
      },
      (error) => {
        console.error('Failed to fetch users', error);
      }
    );
  }
}
