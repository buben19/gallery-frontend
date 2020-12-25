import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Role } from '../data/role.payload';
import { RoleService } from './role.service';

export class RoleDataSource implements DataSource<Role> {

  private roleSubject = new BehaviorSubject<Role[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(
      private roleSevice: RoleService) {
  }

  load(): void {
    this.loadingSubject.next(true);
    this.roleSevice.getAll().pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(role => {
      this.roleSubject.next(role);
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<Role[] | readonly Role[]> {
    return this.roleSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.roleSubject.complete();
    this.loadingSubject.complete();
  }
}