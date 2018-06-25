import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthService {

    constructor(private restangular: Restangular, private router: Router, private toastr: ToastrService) { }
    
    isLoggedIn(){
        
        if(localStorage.getItem('user_role')){
            return true;
        }else{
            return false;
        }
    
    }

    role(){
        
        return localStorage.getItem('user_role');
        
    }

    login(user){
        this.restangular.all('login').post(user).subscribe(res => {
            localStorage.setItem('user_name',res.name);
            localStorage.setItem('user_role',res.role_id);
            localStorage.setItem('user_id',res.id);
            this.router.navigate(['/shelves']);
        }, error => {
            console.log(error);
            this.toastr.error('User credentials invalid!');
        });
    }
    logout(){
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        this.router.navigate(['/logout']);
    }
//     isLoggedIn = false;

//   // store the URL so we can redirect after logging in
//     redirectUrl: string;

//     login(): Observable<boolean> {
//         return of(true).pipe(
//         delay(1000),
//         tap(val => this.isLoggedIn = true)
//         );
//     }

//     logout(): void {
//         this.isLoggedIn = false;
//     }
}