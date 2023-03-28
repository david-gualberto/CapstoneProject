import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable, take, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor( private authSrv:AuthService, private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authSrv.user$.pipe(
        take(1),
        map((user$) => {
          if (localStorage.getItem('user')) {
            const userObj = JSON.parse(localStorage.getItem('user') ?? "");
            const token = userObj.token;
            const decodedToken = jwtDecode<any>(token);
            if (decodedToken.exp < Date.now() / 1000){
              localStorage.removeItem('user')
              this.router.navigate(['login'])
            } else {
              return true;
            }
          }
          return this.router.createUrlTree(['/login']);
        })
      );
  }

}
