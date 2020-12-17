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

  dataSource = null;

  columnsToDisplay = ['id', 'firstName', 'lastName', 'login', 'email', 'created', 'enabled', 'rolesCount', 'privilegesCount'];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.load();
  }
}
