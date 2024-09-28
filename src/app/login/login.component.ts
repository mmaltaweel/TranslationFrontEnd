// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './service/AuthService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLogged=false;
  constructor(private router: Router,private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.loginUser(username, password).subscribe(
        (response) => {
           localStorage.setItem('authToken', response.token);
           localStorage.setItem('authRole', response.authRole);
           localStorage.setItem('authUserName', response.userName);
           if(this.authService.isManager()){
            window.location.href = 'http://localhost:4200/projects';
           }else{
            window.location.href = 'http://localhost:4200/tasks';
           }
        },
        (error) => {
           this.authService.logoutUser();
          alert('Invalid login credentials');
        }
      );
    } else {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
    }
  }
  ngOnInit() {
 
    this.isLogged = this.authService.isAuthenticated();
    
}
}
