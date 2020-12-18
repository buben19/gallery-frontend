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

  constructor(
        private httpClient: HttpClient,
        private localStorage: LocalStorageService) {
  }

  getUsername(): string {
    return this.localStorage.retrieve('username');
  }

  getJwt(): string {
    return this.localStorage.retrieve('jwt');
  }

  /**
   * Check if JWT token is valid in terms of expiration time.
   */
  isJwtValid(): boolean {
    return this.localStorage.retrieve('jwtExpireAt') > new Date();
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
  }

  isLoggedIn(): boolean {
    return this.getJwt() != null;
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
          this.localStorage.store('jwtExpireAt', new Date(decoded.exp * 1000));
          this.localStorage.store('username', decoded.name);
          this.localStorage.store('roles', decoded.roles);
          this.localStorage.store('privileges', decoded.privileges);
        
          this.loggedIn.emit(true);
          return true;
        })
      );
  }

  logout(): Observable<any> {
    return this.httpClient.post('api/auth/logout', null)
      .pipe(
        tap(data => {},
          error => {
            throwError(error);
          }),
        tap(() => this.clear())
      );
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
          this.localStorage.store('jwtExpireAt', new Date(decoded.exp * 1000));
          this.localStorage.store('username', decoded.name);
          this.localStorage.store('roles', decoded.roles);
          this.localStorage.store('privileges', decoded.privileges);
        }, error => {
          this.clear();
        })
      );
  }

  /**
   * Clear authentication state.
   */
  private clear(): void {
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('jwt');
    this.localStorage.clear('jwtExpireAt');
    this.localStorage.clear('username');
    this.localStorage.clear('roles');
    this.localStorage.clear('privileges');

    this.loggedIn.emit(false);
  }
}
