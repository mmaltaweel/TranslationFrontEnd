import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProjectTask, TaskResponse } from "../../project-management/model/ProjectTask";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:5260/api/ProjectTask';
    constructor(private http: HttpClient) { }

    getTasks(skip: number, take: number): Observable<TaskResponse> {
        const params = new HttpParams()
            .set('skip', skip.toString())
            .set('take', take.toString());

        return this.http.get<TaskResponse>(this.apiUrl, { params });
    } 
    createTask(projectId: string|undefined, taskRequest: ProjectTask): Observable<any> {
        const url = `${this.apiUrl}/${projectId}/tasks`;
        return this.http.post(url, taskRequest);
      }
    updateTask(projectId:string|undefined,updatedTask: ProjectTask): Observable<ProjectTask> {
        return this.http.put<ProjectTask>(`${this.apiUrl}/${projectId}/tasks/${updatedTask.id}`, updatedTask, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }
    deleteTask(taskId?: string,projectId?:string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${projectId}/tasks/${taskId}`);
    }
    markTaskAsCompleted(taskId?: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${taskId}/status/completed`, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        });
      } 
}