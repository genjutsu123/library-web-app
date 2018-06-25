import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor( private restangular:Restangular, private toastr: ToastrService,) { }

  getGenres() {
    return this.restangular.all('genres').getList();
  }
  store(genre){
    return this.restangular.all('genres').post(genre).subscribe( genreresponse => {
      console.log('Genre Store Success');
      this.toastr.success('Genre successfully added!');
    }, errorResponse => {
      console.log('Genre Store Error');
    });
  }
  getDeleted(){
    return this.restangular.all('genresdeleted').getList();
  }
}
