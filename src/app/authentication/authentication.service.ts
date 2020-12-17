import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { LoginRequest } from '../data/login-request.payload';
import { LoginResponse } from '../data/login-response.payload';
import { SignupRequest } from '../data/signup-request.payload';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  @Output() roles: EventEmitter<string[]> = new EventEmitter();
  @Output() privileges: EventEmitter<string[]> = new EventEmitter();

  constructor(
        private httpClient: HttpClient,
        private localStorage: LocalStorageService) {
  }

  getUsername(): string {
    return this.localStorage.retrieve('username');
  }

  getJwtToken(): string {
    return this.localStorage.retrieve('jwt');
  }

  /**
   * Check if JWT token is valid in terms of expiration time.
   */
  isJwtValid(): boolean {
    return new Date(this.localStorage.retrieve('jwtExpireAt')) > new Date();
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  hasRole(role: string): boolean {
    const roles = this.localStorage.retrieve('roles');
    return roles ? roles.indexOf(role) > -1 : false;
  }

  signup(signupRequestPayload: SignupRequest): Observable<any> {
    return this.httpClient.post('api/auth/signup', signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('api/auth/login', loginRequest)
      .pipe(
        map(data => {
          const helper = new JwtHelperService();
          const decoded = helper.decodeToken(data.jwt);
          
          this.localStorage.store('refreshToken', data.refreshToken)
          this.localStorage.store('jwt', data.jwt);
          this.localStorage.store('jwtExpireAt', decoded.exp);
          this.localStorage.store('username', decoded.name);
          this.localStorage.store('roles', decoded.roles);
          this.localStorage.store('privileges', decoded.privileges);
        
          this.loggedIn.emit(true);
          this.username.emit(decoded.name);
          this.roles.emit(decoded.roles);
          this.privileges.emit(decoded.privileges)
          return true;
        })
      );
  }

  logout(): void {
    this.httpClient.post('api/auth/logout', null)
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('jwt');
    this.localStorage.clear('jwtExpireAt');
    this.localStorage.clear('username');
    this.localStorage.clear('roles');
    this.localStorage.clear('privileges');
  }

  refresh(): Observable<any> {
    const refreshRequest = {
      token: this.getRefreshToken()
    }
    return this.httpClient.post<LoginResponse>('api/auth/refresh', refreshRequest)
      .pipe(
        tap(data => {
          const helper = new JwtHelperService();
          const decoded = helper.decodeToken(data.jwt);
          
          this.localStorage.store('refreshToken', data.refreshToken)
          this.localStorage.store('jwt', data.jwt);
          this.localStorage.store('jwtExpireAt', decoded.exp);
          this.localStorage.store('username', decoded.name);
          this.localStorage.store('roles', decoded.roles);
          this.localStorage.store('privileges', decoded.privileges);
        })
      );
  }
}
