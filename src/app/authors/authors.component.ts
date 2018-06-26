import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { AuthorService } from '../services/author/author.service';
import { ToastrService } from 'ngx-toastr';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Author } from '../models/Author.model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';


@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  modalRef: BsModalRef;
  continue = true;
  role;
  dataTable: any;
  selectedauthor;
  allauthors;
  author = {
    name: ""
  };
  updateauthor: Author;

  constructor(private authorService: AuthorService,
              private toastr: ToastrService,
              private restangular: Restangular,
              private authService: AuthService,
              private chRef: ChangeDetectorRef,
              private modalService: BsModalService
  ) { }
  
  ngOnInit() {
    this.getAuthors();
    
    this.role = this.authService.role();
  }

  openModal(template: TemplateRef<any>) {
    this.author = new Author();
    this.modalRef = this.modalService.show(template);
  }

  matchAuthor(name){
    this.continue = false;
    for (let author of this.allauthors) {
      if(author.name == name){
        this.toastr.error('Author already exists!');
        return true;

      }
    }
    return false;
  }

  getAuthors(){
    this.authorService.getAuthors().subscribe(res => {
      this.allauthors = res;
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable();
    });
  }

  selectAuthor(data){
    this.updateauthor = data;
    this.selectedauthor = data;
    
  }

  storeAuthor(){
    
    if(!this.matchAuthor(this.author.name)){
      this.continue = false;
      this.restangular.all('authors').post(this.author).subscribe( authorresponse => {
        console.log('Author Store Success');
        this.toastr.success('Author successfully added!');

        this.restangular.one('authors',authorresponse.id).get().subscribe( lastauthorresponse => {
          this.allauthors.push(lastauthorresponse);
        });

      }, errorResponse => {
        console.log('Author Store Error');
        this.continue = true;
      }, () =>{
        this.continue = true;
      });
    }

  }

  updateAuthor(){
    this.continue = false;
    this.restangular.one('authors',this.updateauthor.id).patch(this.updateauthor).subscribe( updateauthorresponse => {
    
      this.restangular.one('authors',updateauthorresponse.id).get().subscribe( lastauthorresponse => {
        this.toastr.success('Author successfully updated!');
        this.allauthors.splice(this.allauthors.indexOf(this.selectedauthor),1, lastauthorresponse);
      }, error => {

      }, () =>{

        this.continue = true;

      });
    });
  }

deleteAuthor(data){
  this.continue = false;
  this.restangular.one('authors',data.id).remove().subscribe(res => {
    this.allauthors.splice(this.allauthors.indexOf(data),1);
    this.toastr.success('Author successfully deleted!');
  }, error => {

  }, () =>{
    this.continue = true;
  });
}

}
