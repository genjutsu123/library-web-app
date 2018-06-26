import { Component, OnInit, ChangeDetectorRef, TemplateRef  } from '@angular/core';
import { GenreService } from '../services/genre/genre.service';
import { ToastrService } from 'ngx-toastr';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
import { Genre } from '../models/Genre.model';
@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent implements OnInit {
  modalRef: BsModalRef;
  continue = true;
  role;
  dataTable: any;
  selectedgenre:Genre;
  allgenres;
  genre:Genre;
  updategenre:Genre;
  constructor(private genreService: GenreService,
              private toastr: ToastrService,
              private restangular: Restangular,
              private authService: AuthService,
              private chRef: ChangeDetectorRef,
              private modalService: BsModalService
  ) { }
  
  ngOnInit() {
    this.getGenres();
    this.role = this.authService.role();
  }

  openModal(template: TemplateRef<any>) {
    this.genre = new Genre();
    this.modalRef = this.modalService.show(template);
  }
  
  matchGenre(name){
    for (let genre of this.allgenres) {
      if(genre.name == name){
        this.toastr.error('Genre already exists!');
        this.continue = true;
        return true;

      }
    }
    return false;
  }
  getGenres(){
    this.genreService.getGenres().subscribe(res => {
      this.allgenres = res;
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable();
    });
  }

  selectGenre(data){
    this.updategenre = data;
    this.selectedgenre = data;
  }

  storeGenre(){
    this.continue = false;
    if(!this.matchGenre(this.genre.name)){
      this.restangular.all('genres').post(this.genre).subscribe( genreresponse => {
        this.toastr.success('Genre successfully added!');
        this.restangular.one('genres',genreresponse.id).get().subscribe( lastgenreresponse => {
          this.allgenres.push(lastgenreresponse);
        }, error => {

        }, () => {
          this.continue = true;
        });

      }, errorResponse => {
        
      }, ()=> {
     
      });
    }
  }

  updateGenre(){
    this.continue = false;
    this.restangular.one('genres',this.updategenre.id).patch(this.updategenre).subscribe( res => {
      this.restangular.one('genres',res.id).get().subscribe( res => {
        this.toastr.success('Genre successfully updated!');
        this.allgenres.splice(this.allgenres.indexOf(this.selectedgenre),1, res);
        this.continue = true;
      });
    });
  }

  deleteGenre(data){
    this.continue = false;
    this.restangular.one('genres',data.id).remove().subscribe(res => {
      
    }, error => {

    }, ()=>{
      this.allgenres.splice(this.allgenres.indexOf(data),1);
      this.toastr.success('Genre successfully deleted!');
      this.continue = true;
    });
  }

}
