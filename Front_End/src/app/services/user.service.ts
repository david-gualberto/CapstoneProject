import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserProfile } from '../interfaces/jwt-response';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl:string = "http://localhost:9090/user/"

  constructor(private http: HttpClient) { }

  getUser(id:number) {
    return this.http
    .get<UserProfile>(`${this.userUrl}${id}`)
    .pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
