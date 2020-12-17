import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../data/user.payload';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
