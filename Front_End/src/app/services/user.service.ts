import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserProfile } from '../interfaces/jwt-response';
import { catchError } from 'rxjs';
import { ResInfo, Reservation } from '../interfaces/reservation';
import { Register } from '../interfaces/register';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl:string = "http://localhost:9090/user/"

 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    }),
    withCredentials: true
  };

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

  getReservationList(id:number) {
    return this.http.get<Reservation[]>(`http://localhost:9090/getreservation/${id}`).pipe(catchError((err)=>{
      throw err;
    }))
  }

  removeReservation(id:number, res:Reservation) {
    return this.http.post<Reservation[]>(`http://localhost:9090/removeReservation/${id}`, res).pipe(catchError((err)=>{
      throw err;
    }))
  }

  modifyRes(id:number, resInfo: ResInfo, res:Reservation){
    return this.http.put<Reservation>(`http://localhost:9090/updateRes/user/${id}/reservation/${resInfo.reservationDate}/${resInfo.idrestaurant}`, res).pipe(catchError((err)=>{
      throw err;
    }))
  }

  updateUser(id:number, user:Register) {
    return this.http.put<Register>(`http://localhost:9090/user/update/${id}`, user).pipe(catchError((err)=>{
      throw err;
    }))
  }
}
