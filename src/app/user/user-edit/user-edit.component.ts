import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/data/user.payload';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  host: {
    'class': 'user-edit'
  }
})
export class UserEditComponent implements OnInit {

  @Input() user: User = {} as User;

  userForm: FormGroup;

  constructor(
      private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      login: [this.user.login, Validators.required],
      password: [this.user.password],
      confirmPassword: [this.user.password],
      email: [this.user.email],
      created: [this.user.created],
      enabled: [this.user.enabled],
      roles: [this.user.roles]
    }, {validators: passwordValidator})
  }

  public getUser(): User {
    return this.userForm.value;
  }
}

const passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value ? null : {passwordDontMatch: true};
}
