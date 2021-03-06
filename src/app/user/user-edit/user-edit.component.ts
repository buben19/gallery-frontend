import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Role } from 'src/app/data/role.payload';
import { User } from 'src/app/data/user.payload';
import { ListboxItemComparator, ListboxPresenter } from 'src/app/dual-listbox/dual-listbox.component';
import { RoleDataSource } from 'src/app/role/role.datasource';
import { RoleService } from 'src/app/role/role.service';

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
  @Output() userChanges: EventEmitter<User> = new EventEmitter<User>();
  @Output() userCreatable: EventEmitter<boolean> = new EventEmitter<boolean>();

  createNow: boolean = true;
  valid: boolean = false;

  userForm: FormGroup;
  roleDataSource: RoleDataSource;
  rolePresenter: ListboxPresenter<Role> = (role: Role) => role.name;
  roleComparator: ListboxItemComparator<Role, number> = (role: Role, id: number) => role.id === id;

  constructor(
      private fb: FormBuilder,
      private roleService: RoleService) {
    this.roleDataSource = new RoleDataSource(this.roleService);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      login: [this.user.login, Validators.required],
      withPassword: [this.user.password ? true : false],
      password: [this.user.password],
      confirmPassword: [this.user.password],
      email: [this.user.email, Validators.required],
      created: [this.user.created],
      enabled: [this.user.enabled],
      roles: [this.user.roles ? this.user.roles : []],
    }, {validators: this.passwordValidator});
    this.userForm.statusChanges.subscribe(status => this.statusChanges(status));
    this.roleDataSource.load();
  }

  passwordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.get('withPassword').value) {
      let password = control.get('password');
      let confirmPassword = control.get('confirmPassword');
      if (!password.value) {
        return {password: {passwordIsEmpty: true}};
      } else if (!confirmPassword.value) {
        return {password: {confirmPasswordIsEmpty: true}};
      } else {
        return password.value === confirmPassword.value ? null : {password: {passwordDontMatch: true}};
      }
    } else {
      return null;
    }
  }

  roleSelectionChanged(roles: Role[]): void  {
    this.userForm.patchValue({'roles': roles.map(role => role.id)});
  }

  public getUser(): User {
    return this.createUser();
  }

  statusChanges(status: string): void {
    this.valid = status === 'VALID';
    this.userCreatable.emit(this.valid);
    if (this.valid) {
      this.dataChanges(this.userForm.value);
    }
  }

  dataChanges(data: any): void {
    if (this.valid) {
      this.userChanges.emit(this.createUser());
    }
  }

  createUser(): User {
    let userData = this.userForm.value;
    return {
      id: this.user.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      login: userData.login,
      email: userData.email,
      password: userData.withPassword ? userData.password : null,
      created: this.createNow ? new Date() : userData.created,
      enabled: userData.enabled,
      roles: userData.roles,
    };
  }
}
