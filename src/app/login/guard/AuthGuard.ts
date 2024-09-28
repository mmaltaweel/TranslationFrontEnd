import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router"; // Import CanActivate
import { AuthService } from "../service/AuthService";
  // Correct path, assuming it is lowercase `auth.service.ts`

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { // Implement CanActivate
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
