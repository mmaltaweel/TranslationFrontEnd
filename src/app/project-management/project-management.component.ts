import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Project, ProjectResponse } from './model/Project';
import { ProjectTask } from './model/ProjectTask';
import { ProjectService } from './service/ProjectService';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

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
  project: Project = {

  };
  submitted: boolean = false;

  constructor(private projectService: ProjectService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
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
  editProject(project: Project) {
    this.project = { ...project };
    this.projectDialog = true;
  }

  deleteProject(project: Project) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + project.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projects = this.projects.filter(val => val.id !== project.id);
        this.project = {};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.projectDialog = false;
    this.submitted = false;
  }
  validateForm(): boolean {
    return (
      this.isStringInvalid(this.project.name) ||
      this.isStringInvalid(this.project.description) ||
      !this.isValidDate(this.project.startDate) ||
      !this.isValidDate(this.project.endDate)
    );
  }

  saveProject() {
    this.submitted = true;
    if (!this.project || this.validateForm()) {
      return;
    }
    if (this.project.name && this.project.name.trim()) { }

    if (this.project.id) {
      this.projects[this.findIndexById(this.project.id)] = this.project;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'project Updated', life: 3000 });
      this.projectService.updateProject(this.project).subscribe(
        response => {
          console.log('Project created successfully:', response);
          this.getProjects({ first: 0, rows: this.rows });
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
          this.getProjects({ first: 0, rows: this.rows });
        },
        error => {
          console.error('Error creating project:', error);
        }
      );
    }
    this.projectDialog = false;
    this.project = {};
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
}
