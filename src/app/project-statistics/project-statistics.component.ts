import { Component } from '@angular/core';
import { ReportService } from './service/ReportService';
import { ReportFilterDto } from './model/Report';
import { AuthService } from '../login/service/AuthService';
import { UserDto } from '../login/model/User';
import { Project, ProjectResponse } from '../project-management/model/Project';
import { ProjectService } from '../project-management/service/ProjectService';

@Component({
  selector: 'app-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrl: './project-statistics.component.css'
})
export class ProjectStatisticsComponent {
  taskStatusChartData: any;
  taskStatusChartDataOptions: any;

  projectCompletionTrendChartData: any;

  translatorBreakdownChartData: any;
  translatorBreakdownChartDataptions: any;

  readyTaskStatus: boolean = false;
  readyCompletionTrendData: boolean = false;
  readyTranslatorBreakdownData: boolean = false;
  translators: UserDto[] = [];
  projects: Project[] = [];
  filter: ReportFilterDto = {
    taskDueDate: undefined,
    startDate: undefined,
    endDate: undefined,
    translatorId: undefined,  // Example filters, modify as needed
    projectId: undefined
  };
  constructor(private projectService: ProjectService,private authService: AuthService, private reportService: ReportService) { }

  ngOnInit(): void {
    this.fetchUsers();
    this. getProjects();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');


    this.taskStatusChartDataOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
    this.translatorBreakdownChartDataptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Translators'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Tasks'
          }
        }
      }
    };
    this.loadTaskStatusData(this.filter);
    this.loadCompletionTrendData(this.filter);
    this.loadTranslatorBreakdownData(this.filter);
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
  onDropdownChange(event: any) 
  {
    this.ngOnInit();
  }
  getProjects(): void {
    this.projectService.getProjects(0, 0).subscribe(
      (data: ProjectResponse) => {
        this.projects = data.dataList;
        },
      error => {}
    );
  }
  loadTaskStatusData(filter: ReportFilterDto): void {
    this.reportService.getTaskStatusData(filter).subscribe(data => {
      this.taskStatusChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      };
      this.readyTaskStatus = true;
    });
  }

  loadCompletionTrendData(filter: ReportFilterDto): void {
    this.reportService.getCompletionTrendData(filter).subscribe(data => {
      this.projectCompletionTrendChartData = {
        labels: data.labels,
        datasets: [
          {
            label: 'Completion Trend',
            data: data.data,
            fill: true
          }
        ]
      };
      this.readyCompletionTrendData = true;
    });
  }

  loadTranslatorBreakdownData(filter: ReportFilterDto): void {
    this.reportService.getTranslatorBreakdownData(filter).subscribe(data => {
      this.translatorBreakdownChartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            label: 'Translators Trends',
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384']
          }
        ]
      };

      this.readyTranslatorBreakdownData = true;
    });
  }
}



