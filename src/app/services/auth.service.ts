import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user : any) {
    console.log('login', user);
    return this.http.post('http://localhost:3000/api/login',  {user});
  }

  adminLogin(user : any) {
    console.log('adminLogin', user);
    return this.http.post('http://localhost:3000/api/adminLogin',  {user});
  }

  register(user : any) {
    console.log('register', user);
    return this.http.post('http://localhost:3000/api/register', {user});
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  logout() {
    localStorage.removeItem('authToken');
  }
}
