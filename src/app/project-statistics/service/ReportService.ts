import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartDataDto, ReportFilterDto } from '../model/Report';
 
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:5260/api/report';  // Base URL for API

  constructor(private http: HttpClient) {}

  // Fetch Task Status Data
  getTaskStatusData(filter: ReportFilterDto): Observable<ChartDataDto> {
    let params = new HttpParams();
    if (filter.projectId) {
      params = params.append('projectId', filter.projectId);
    }
    if (filter.translatorId) {
      params = params.append('translatorId', filter.translatorId);
    }
    if (filter.taskDueDate) {
      params = params.append('taskDueDate', filter.taskDueDate.toISOString());
    }

    return this.http.get<ChartDataDto>(`${this.baseUrl}/task-status`, { params });
  }

  // Fetch Project Completion Trend Data
  getCompletionTrendData(filter: ReportFilterDto): Observable<ChartDataDto> {
    let params = new HttpParams();
    if (filter.startDate) {
      params = params.append('startDate', filter.startDate.toISOString());
    }
    if (filter.endDate) {
      params = params.append('endDate', filter.endDate.toISOString());
    }
    if (filter.translatorId) {
      params = params.append('translatorId', filter.translatorId);
    }

    return this.http.get<ChartDataDto>(`${this.baseUrl}/completion-trend`, { params });
  }

  // Fetch Translator Breakdown Data
  getTranslatorBreakdownData(filter: ReportFilterDto): Observable<ChartDataDto> {
    let params = new HttpParams();
    if (filter.projectId) {
      params = params.append('projectId', filter.projectId);
    }
    if (filter.translatorId) {
      params = params.append('translatorId', filter.translatorId);
    }
    if (filter.taskDueDate) {
      params = params.append('taskDueDate', filter.taskDueDate.toISOString());
    }

    return this.http.get<ChartDataDto>(`${this.baseUrl}/translator-breakdown`, { params });
  }
}
