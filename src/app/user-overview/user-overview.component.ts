import { Component, OnInit } from '@angular/core';
import { User } from '../data/user.payload';
import { UserService } from '../user/user.service';
import { UserDataSource } from './user-datasource';

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.css']
})
export class UserOverviewComponent implements OnInit {

  columnsToDisplay = ['id', 'firstName', 'lastName', 'login', 'email', 'created', 'enabled', 'rolesCount', 'privilegesCount'];

  constructor(
      public dataSource: UserDataSource) {
  }

  ngOnInit(): void {
    this.dataSource.load();
  }
}
