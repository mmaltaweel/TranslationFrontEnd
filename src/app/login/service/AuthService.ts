import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Remove JWT_OPTIONS as it's used differently
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = 'http://localhost:5260';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {} // Inject JwtHelperService

  registerUser(newUser: User): Observable<User> {
    newUser.id = '';
    return this.http.post<User>(`${this.apiUrl}/api/Authenticate/RegisterTranslator`, newUser);
  }

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Authenticate/Login`, { username, password });
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    // Check whether the token is expired and return true or false
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  logoutUser(): void {
    localStorage.removeItem('authToken'); // Remove the token from storage
  }
  isManager():boolean {
    const tokenRole = localStorage.getItem('authRole');
    if (tokenRole) {
      if (tokenRole === "ProjectManager") {
        return true;
      } 
      else{
         return false;
      }
    }
    return false;
  }
}
