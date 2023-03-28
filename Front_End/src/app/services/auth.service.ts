import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../interfaces/register';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login';
import { JwtResponse } from '../interfaces/jwt-response';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string = "http://localhost:9090/";
  private authSubj = new BehaviorSubject<null | JwtResponse>(null);
  user$ = this.authSubj.asObservable();
  constructor(private http: HttpClient, private r:Router) { }

  register(register: Register) {
    return this.http.post<Register>(this.url + "register", register).pipe(catchError(err=>{
      throw err
    }))
  }

  login(login: Login): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.url + "login", login).pipe(
      catchError(err => {
        throw err;
      }),
      tap((res: JwtResponse) => {
        this.authSubj.next(res);
        localStorage.setItem("user", JSON.stringify(res));
      })
    );
  }

  logout() {
    this.authSubj.next(null);
    localStorage.removeItem('user')
    this.r.navigate(['login'])
  }
}
