import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  loggedIn;
  role;
  navigationSubscription;

  constructor(private authService: AuthService,
     private route: ActivatedRoute,
      private router: Router, 
      private cdRef: ChangeDetectorRef) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
          if (e instanceof NavigationEnd) {
            this.initialiseInvites();
          }
    });
  }

  ngOnInit() {
    
  }

  initialiseInvites() {
    this.loggedIn = this.authService.isLoggedIn();
    this.role = this.authService.role();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
      this.cdRef.detach();
      this.navigationSubscription.unsubscribe();
    }
  }
}


