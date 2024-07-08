import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUser: any;

  constructor() {}

  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getLoggedInUser(): any {
    if (this.loggedInUser) {
      return this.loggedInUser;
    } else if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        this.loggedInUser = JSON.parse(storedUser);
        return this.loggedInUser;
      }
    }
    return null;
  }

  logout(): void {
    this.loggedInUser = null;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem('currentUser');
    }
  }
}
