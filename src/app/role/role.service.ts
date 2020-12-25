import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../data/role.payload';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
      private http: HttpClient) {
  }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>('api/roles');
  }
}
