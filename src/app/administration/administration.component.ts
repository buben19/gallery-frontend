import { Component, OnInit, ViewChild } from '@angular/core';
import { UserEditComponent } from '../user/user-edit/user-edit.component';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  @ViewChild(UserEditComponent) editComponent: UserEditComponent;

  constructor() {
  }

  ngOnInit(): void {
  }

  onTest():void {
    console.log(this.editComponent.getUser());
  }
}
