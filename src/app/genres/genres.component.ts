import { Component, OnInit } from '@angular/core';
import { GenreService } from '../services/genre/genre.service';
import { ToastrService } from 'ngx-toastr';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent implements OnInit {

  constructor(
    private genreService: GenreService,
    private toastr: ToastrService,
    private restangular: Restangular,
    private authService: AuthService
  ) { }
  role;
  selectedgenre;
  allgenres;
  genre = {
    name:""
  }
  updategenre = {
    id: "",
    name: ""
  };
  ngOnInit() {
    this.getGenres();
    this.role = this.authService.role();
  }
  matchGenre(name){
    for (let genre of this.allgenres) {
      if(genre.name == name){
        this.toastr.error('Genre already exists!');
        return true;

      }
    }
    return false;
  }
  getGenres(){
    this.genreService.getGenres().subscribe(res => {
      this.allgenres = res;
    });
  }

  selectGenre(data){
    this.updategenre.id = data.id;
    this.updategenre.name = data.name;
    this.selectedgenre = data;
  }

  storeGenre(){
    if(!this.matchGenre(this.genre.name)){
      console.log(this.genre.name);
      this.restangular.all('genres').post(this.genre).subscribe( genreresponse => {
        console.log('Genre Store Success');
        this.toastr.success('Genre successfully added!');

        this.restangular.one('genres',genreresponse.id).get().subscribe( lastgenreresponse => {
          this.allgenres.push(lastgenreresponse);
        });

      }, errorResponse => {
        console.log('Genre Store Error');
      });
    }
  }

  updateGenre(){
  
    this.restangular.one('genres',this.updategenre.id).patch(this.updategenre).subscribe( res => {
    
      this.restangular.one('genres',res.id).get().subscribe( res => {
        this.toastr.success('Genre successfully updated!');
        this.allgenres.splice(this.allgenres.indexOf(this.selectedgenre),1, res);
      });
    });
  }

  deleteGenre(data){
    this.restangular.one('genres',data.id).remove().subscribe(res => {
      this.allgenres.splice(this.allgenres.indexOf(data),1);
      this.toastr.success('Genre successfully deleted!');
    });
  }

}
