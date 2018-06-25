import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor( private restangular:Restangular, private toastr: ToastrService,) { }

  getAuthors() {
    return this.restangular.all('authors').getList();
  }

  store(author){
    return this.restangular.all('authors').post(author).subscribe( authorresponse => {
      console.log('Author Store Success');
      this.toastr.success('Author successfully added!');
    }, errorResponse => {
      console.log('Author Store Error');
    });
  }
  getDeleted(){
    return this.restangular.all('authorsdeleted').getList();
  }
}
