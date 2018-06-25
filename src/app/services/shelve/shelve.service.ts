import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShelveService {

  constructor(private restangular: Restangular, private toastr: ToastrService,) { }

  getShelves(){
    return this.restangular.all('shelves').getList();
  }

  store(shelve){
    return this.restangular.all('shelves').post(shelve).subscribe( shelveresponse => {
      console.log('Shelve Store Success');
      this.toastr.success('Shelve successfully added!');
    }, errorResponse => {
      console.log('Shelve Store Error');
    });
  }
  
  getDeleted(){
    return this.restangular.all('shelvesdeleted').getList();
  }
}
