import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelvesComponent } from './shelves/shelves.component';
import { GenresComponent } from './genres/genres.component';
import { BooksComponent } from "./books/books.component";
import { AuthorsComponent } from './authors/authors.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { SignoutComponent } from './auth/signout/signout.component';
import { CheckLogin } from './services/auth/checklogin.service';
import { ProfileComponent } from './profile/profile.component';
import { ArchivesComponent } from './archives/archives.component';
const routes: Routes = [
  { path: '', component: ShelvesComponent,canActivate:[AuthGuard] },
  // { path: '', component: ShelvesComponent },
  { path: 'logout', redirectTo: '/signin' },
  { path: 'archives', component: ArchivesComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent, canActivate: [CheckLogin]},
  { path: 'signin', component: SigninComponent, canActivate: [CheckLogin]},
  { path: 'signout', component: SignoutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'shelves', component: ShelvesComponent, canActivate: [AuthGuard]},
  { path: 'genres', component: GenresComponent, canActivate: [AuthGuard]},
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard]},
  { path: 'authors', component: AuthorsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
