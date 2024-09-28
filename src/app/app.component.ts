import { Component } from '@angular/core';
import { AuthService } from './login/service/AuthService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  UserName =  localStorage.getItem('authUserName');
  title = 'translation-frontend';
  isLogged = false;
  isManager = false;

  constructor(private activatedRoute: ActivatedRoute, private authService: AuthService, private router: Router) {

  }
  ngOnInit() {
    this.isLogged = this.authService.isAuthenticated();
    this.isManager = this.authService.isManager();


  }
  logoutUser(): any {
    this.authService.logoutUser();
    this.isLogged = false;
    this.router.navigate(['/login']);
  }
}