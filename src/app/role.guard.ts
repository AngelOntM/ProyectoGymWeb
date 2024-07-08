// role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './userservice.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'];
    const user = this.userService.getLoggedInUser();

    if (user && expectedRoles.includes(user.rol)) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
