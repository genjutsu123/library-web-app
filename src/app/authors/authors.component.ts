import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../services/author/author.service';
import { ToastrService } from 'ngx-toastr';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  constructor(
    private authorService: AuthorService,
    private toastr: ToastrService,
    private restangular: Restangular,
    private authService: AuthService
  ) { }
  role;
  selectedauthor;
  allauthors;
  author = {
    name: ""
  };
  updateauthor = {
    id: "",
    name: ""
  };
  ngOnInit() {
    this.getAuthors();
    this.role = this.authService.role();
  }

  matchAuthor(name){
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
    });
  }

  selectAuthor(data){
    this.updateauthor.id = data.id;
    this.updateauthor.name = data.name;
    this.selectedauthor = data;
    
  }

  storeAuthor(){
    
    if(!this.matchAuthor(this.author.name)){
      console.log(this.author.name);
      this.restangular.all('authors').post(this.author).subscribe( authorresponse => {
        console.log('Author Store Success');
        this.toastr.success('Author successfully added!');

        this.restangular.one('authors',authorresponse.id).get().subscribe( lastauthorresponse => {
          this.allauthors.push(lastauthorresponse);
        });

      }, errorResponse => {
        console.log('Author Store Error');
      });
    }

  }

  updateAuthor(){
  
    this.restangular.one('authors',this.updateauthor.id).patch(this.updateauthor).subscribe( updateauthorresponse => {
    
      this.restangular.one('authors',updateauthorresponse.id).get().subscribe( lastauthorresponse => {
        this.toastr.success('Author successfully updated!');
        this.allauthors.splice(this.allauthors.indexOf(this.selectedauthor),1, lastauthorresponse);
      });
    });
  }

deleteAuthor(data){
    this.restangular.one('authors',data.id).remove().subscribe(res => {
      this.allauthors.splice(this.allauthors.indexOf(data),1);
      this.toastr.success('Author successfully deleted!');
    });
}

}
