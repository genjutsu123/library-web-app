import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class CheckLogin implements CanActivate {
    
    constructor (private authService: AuthService, private router: Router) {}

    canActivate() {
        if (this.authService.isLoggedIn() == true) { 
            this.router.navigate(['/shelves']);
            return false;
        } else {
            console.log("OnlyLoggedInUsers:");
            
            return true;
        }
    }
}