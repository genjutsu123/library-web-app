import { Component, OnInit } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../services/book/book.service';
import { AuthorService } from '../services/author/author.service';
import { GenreService } from '../services/genre/genre.service';
import { ShelveService } from '../services/shelve/shelve.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css']
})
export class ArchivesComponent implements OnInit {
  allbooks;
  allauthors;
  allgenres;
  allshelves;
  role;
  constructor(
    private restangular: Restangular,
    private toastr: ToastrService,
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private shelveService: ShelveService,
  ) { }

  ngOnInit() {
    this.getBooks();
    this.getAuthors();
    this.getGenres();
    this.getShelves();
    this.role = localStorage.getItem('user_role');
  }

  getBooks(){
    this.bookService.getDeleted().subscribe(res => {
      this.allbooks = res;
    });
  }
  
  getShelves(){
    this.shelveService.getDeleted().subscribe(res => {
      this.allshelves = res;
    });
  }

  getAuthors(){
    this.authorService.getDeleted().subscribe(res => {
      this.allauthors = res;
    });
  }

  getGenres(){
    this.genreService.getDeleted().subscribe(res => {
      this.allgenres = res;
    });
  }

  restoreBook(book){
    let data = {
      id: book.id
    };
    this.restangular.all('bookrestore').post(data).subscribe(res => {
      this.allbooks.splice(this.allbooks.indexOf(book),1);
      this.toastr.success('Book Successfully Restored!');
    }); 
  }


}
