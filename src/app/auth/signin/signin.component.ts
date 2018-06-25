import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Restangular } from 'ngx-restangular';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService, private restangular: Restangular) { }
  users = [];
  user = {
    email: "",
    password: "",
  }
  ngOnInit() {
  }

  login(){
    this.authService.login(this.user);
    
  }
}
