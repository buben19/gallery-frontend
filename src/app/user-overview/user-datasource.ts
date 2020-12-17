import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from "@angular/cdk/table";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { User } from '../data/user.payload';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataSource implements DataSource<User> {

  private userSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(
      private userService: UserService) {
  }

  load() {
    this.loadingSubject.next(true);
    this.userService.getAll().pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(user => {
      this.userSubject.next(user);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<User[] | readonly User[]> {
    return this.userSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.userSubject.complete();
    this.loadingSubject.complete();
  }
}