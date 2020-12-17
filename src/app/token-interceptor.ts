import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication/authentication.service';
import { LoginResponse } from './data/login-response.payload';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  refrehing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
      return next.handle(req);
    }

    if (this.authenticationService.isJwtValid()) {
      const jwtToken = this.authenticationService.getJwtToken();
      if (jwtToken) {
        return next.handle(this.addToken(req, jwtToken))
          .pipe(
            catchError(error => {
              if (error instanceof HttpErrorResponse && error.status === 403) {
                return this.refresh(req, next);
              } else {
                return throwError(error);
              }
            })
          );
      }
    } else {
      return this.refresh(req, next);
    }
    return next.handle(req);
  }

  private refresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refrehing) {
      this.refrehing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refresh()
      .pipe(
        switchMap((refreshTokenResponse: LoginResponse) => {
          this.refrehing = false;
          this.refreshTokenSubject.next(null);
          return next.handle(this.addToken(req, null));
        })
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap((res) => {
          return next.handle(this.addToken(req, this.authenticationService.getJwtToken()))
        })
      );
    }
  }

  addToken(req: HttpRequest<any>, jwtToken: any): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
    });
  }
}