import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AccordionModule, BsDropdownModule, TypeaheadModule, ModalModule } from 'ngx-bootstrap';
import { RestangularModule} from 'ngx-restangular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ShelvesComponent } from './shelves/shelves.component';
import { BooksComponent } from './books/books.component';
import { GenresComponent } from './genres/genres.component';
import { FormsModule } from '@angular/forms';
import { AuthorsComponent } from './authors/authors.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { SignoutComponent } from './auth/signout/signout.component';
import { CheckLogin } from './services/auth/checklogin.service';
import { ProfileComponent } from './profile/profile.component';
import { ArchivesComponent } from './archives/archives.component';
export function RestangularConfigFactory (RestangularProvider) {
  RestangularProvider.setBaseUrl(environment.apiUrl);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ShelvesComponent,
    BooksComponent,
    GenresComponent,
    AuthorsComponent,
    DashboardComponent,
    SignupComponent,
    SigninComponent,
    SignoutComponent,
    ProfileComponent,
    ArchivesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    RestangularModule.forRoot(RestangularConfigFactory),
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),

  ],
  providers: [AuthGuard,AuthService,CheckLogin],
  bootstrap: [AppComponent]
})
export class AppModule { }
