import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Restangular } from 'ngx-restangular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  constructor( private toastr: ToastrService, private restangular: Restangular, private route: Router) { }
  users = [];
  user = {
    name: "",
    email: "",
    password: "",
  }
  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this.restangular.all('users').getList().subscribe( users => {
      users.forEach(element => {
        this.users.push(element.email);
      });
      
    }); 
  }
  matchUser(email){
    for (let user of this.users) {
      if(user == email){
        this.toastr.error('User already exists!');
        console.log("MATCH:TRUE");
        
        return true;
      }
    }
    console.log("MATCH:FALSE");
    
    return false;
  }

  onSignup(){
    if(this.matchUser(this.user.email) === false){
      this.restangular.all('users').post(this.user).subscribe(res => {
        this.toastr.success('Successfully Signed Up');
        this.route.navigate(['/signin']);
      }, error =>{

      });
    }
  }

}
