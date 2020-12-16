import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  loggedIn: boolean;
  username: string;
  admin: boolean;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.loggedIn.subscribe((data: boolean) => this.loggedIn = data);
    this.authenticationService.username.subscribe((data: string) => this.username = data);
    this.authenticationService.roles.subscribe((data: string[]) => this.admin = data.indexOf('ROLE_ADMIN') > -1)
    this.loggedIn = this.authenticationService.isLoggedIn();
    this.username = this.authenticationService.getUsername();
    this.admin = this.authenticationService.hasRole('ROLE_ADMIN');
  }
}
