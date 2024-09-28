import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Project, ProjectResponse } from "../model/Project";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:5260/api/Project';
  constructor(private http: HttpClient) { }

  getProjects(skip: number, take: number): Observable<ProjectResponse> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('take', take.toString());
      
    return this.http.get<ProjectResponse>(this.apiUrl, { params });
  }
  createProject(newProject: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, newProject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  updateProject(updatedProject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${updatedProject.id}`, updatedProject, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  deleteProject(projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  }
}