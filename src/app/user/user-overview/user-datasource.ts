import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/data/user.payload';
import { UserService } from '../user.service';

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