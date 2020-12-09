import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../data/login-request.payload';
import { AuthenticationService } from '../shared/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequest: LoginRequest;
  isError: boolean;

  constructor(
        private authenticationService: AuthenticationService, 
        private activatedRoute: ActivatedRoute,
        private router: Router) {
    this.loginRequest = {
      login: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login(): void {
    this.loginRequest.login = this.loginForm.get('username').value;
    this.loginRequest.password = this.loginForm.get('password').value;

    this.authenticationService.login(this.loginRequest).subscribe(data => {
      this.isError = false;
      this.router.navigateByUrl('');
    }, error => {
      this.isError = true;
      throwError(error);
    });
  }
}
