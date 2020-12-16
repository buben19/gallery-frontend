import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { LoginRequest } from '../data/login-request.payload';
import { LoginResponse } from '../data/login-response.payload';
import { SignupRequest } from '../data/signup-request.payload';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  @Output() roles: EventEmitter<string[]> = new EventEmitter();
  @Output() privileges: EventEmitter<string[]> = new EventEmitter();

  refreshToken = {
    refreshToken: this.getRefreshToken(),
    username: this.getUsername()
  }

  constructor(
        private httpClient: HttpClient,
        private localStorage: LocalStorageService) {
  }

  getUsername(): string {
    return this.localStorage.retrieve('username');
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve('refreshToken');
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  hasRole(role: string): boolean {
    return this.localStorage.retrieve('roles').indexOf(role) > -1;
  }

  signup(signupRequestPayload: SignupRequest): Observable<any> {
    return this.httpClient.post('api/auth/signup', signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('api/auth/login', loginRequest).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('roles', data.roles);
        this.localStorage.store('privileges', data.privileges);

        this.loggedIn.emit(true);
        this.username.emit(data.username);
        this.roles.emit(data.roles);
        this.privileges.emit(data.privileges)
        return true;
      }));
  }

  logout(): void {
    this.httpClient.post('api/auth/logout', this.refreshToken, { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('roles');
    this.localStorage.clear('privileges');
  }

  refresh(): Observable<any> {
    return this.httpClient.post<LoginResponse>('api/auth/refresh', this.refreshToken).pipe(tap(data => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('roles', data.roles);
        this.localStorage.store('privileges', data.privileges);
      }));
  }
}
