import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AdministrationComponent } from './administration/administration.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DualListboxComponent } from './dual-listbox/dual-listbox.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TokenInterceptor } from './token-interceptor';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { MatButtonModule } from '@angular/material/button';

export function tokenGetter(): string {
  return localStorage.getJwtToken();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationBarComponent,
    AdministrationComponent,
    UserOverviewComponent,
    DualListboxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    MatTableModule,
    FontAwesomeModule,
    MatChipsModule,
    MatButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
