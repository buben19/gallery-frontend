import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/data/user.payload';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  @Input() user: User = {} as User;
  @Output() userCreated: EventEmitter<number> = new EventEmitter<number>();

  userCreatable: boolean = false;

  constructor(
      private userSevice: UserService) {
  }

  ngOnInit(): void {
  }

  userChanges(user: User): void {
    this.user = user;
  }

  userCreatableChanges(creatable: boolean): void {
    this.userCreatable = creatable;
  }

  create(): void {
    this.userSevice.create(this.user).subscribe((id) => {
      this.userCreated.emit(id);
    });
  }
}
