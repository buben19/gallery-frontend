import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../data/user.payload';
import { UserEditComponent } from '../user/user-edit/user-edit.component';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
