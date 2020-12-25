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
    return this.http.get<User[]>('api/users');
  }

  create(user: User): Observable<number> {
    return this.http.post<number>('api/users', user);
  }

  update(id: number, user: User): Observable<any> {
    return this.http.put('api/users/' + id, user);
  }
}
