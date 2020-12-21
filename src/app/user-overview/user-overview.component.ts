import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { User } from '../data/user.payload';
import { UserService } from '../user/user.service';
import { UserDataSource } from './user-datasource';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserOverviewComponent implements OnInit {

  dataSource = null;
  expandedUser: User | null;

  columns = [
    {name: 'id', description: 'Id', get: user => user.id},
    {name: 'firstName', description: 'First Name', get: user => user.firstName},
    {name: 'lastName', description: 'Last Name', get: user => user.lastName},
    {name: 'login', description: 'Login', get: user => user.login},
    {name: 'email', description: 'Email', get: user => user.email},
    {name: 'created', description: 'Created', get: user => user.created},
    {name: 'enabled', description: 'Enabled', get: user => user.enabled},
    {name: 'rolesCount', description: 'Roles', get: user => user.roles.length},
  ];

  get columnsToDisplay(): string[] {
    return this.columns.map(e => e.name);
  }

  constructor(
      private userService: UserService) {
  }

  ngOnInit(): void {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.load();
  }
}
