import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  faSignOutAlt = faSignOutAlt;
  loggedIn: boolean;
  username: string;
  admin: boolean;

  constructor(
      private authenticationService: AuthenticationService, 
      private router: Router) {
  }

  ngOnInit(): void {
    this.authenticationService.loggedIn.subscribe((data: boolean) => {
      this.loggedIn = data;
      this.username = this.authenticationService.getUsername();
      this.admin = this.authenticationService.hasRole('ROLE_ADMIN');
    });
    this.loggedIn = this.authenticationService.isLoggedIn();
    this.username = this.authenticationService.getUsername();
    this.admin = this.authenticationService.hasRole('ROLE_ADMIN');
  }

  logout(): void {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigateByUrl("/"));
  }
}
