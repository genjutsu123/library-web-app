import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthorService } from '../services/author/author.service';
import { BookService } from '../services/book/book.service';
import { GenreService } from '../services/genre/genre.service';
import { ShelveService } from '../services/shelve/shelve.service';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  role;
  allbooks;
  allauthors = [];
  allgenres;
  allshelves;
  author = {
    id: "",
    name: ""
  }
  selectedbook = {
    id: "",
    name: "",
    author_id:"",
    genre_id:"",
    shelf_id:"",
  }
  book = {
    name: "",
    author_id:"",
    genre_id:"",
    shelf_id:"",
  }
  basebook = [];

  constructor(private authorService:AuthorService,
              private bookService:BookService,
              private genreService:GenreService,
              private shelveService:ShelveService,
              private toastr: ToastrService,
              private restangular: Restangular,
              private authService: AuthService,
  ) {}
  
  ngOnInit() {
    this.getBooks();
    this.getAuthors();
    this.getGenres();
    this.getShelves();
    this.role = this.authService.role();
  }

  clearBook(){
 
  }

  matchBook(name){
    for (let book of this.allbooks) {
      if(book.name == name){
        return true;
      }
    }
    return false;
  }

  onChange(){

    
  }

  selectBook(book){    
    this.selectedbook.id = book.id;
    this.selectedbook.name = book.name;
    this.selectedbook.author_id = book.author_id;
    this.selectedbook.genre_id = book.genre_id;
    this.selectedbook.shelf_id = book.shelf_id;
    this.basebook = book;
  }

  storeBook(){
  
    if(this.matchBook(this.book.name) == false){
      // let book = this.bookService.store(this.book);
      // console.log(book);
    
      this.restangular.all('books').post(this.book).subscribe( bookresponse => {
        console.log('Book Store Success');
        this.toastr.success('Book Successfully Stored');
        this.allbooks.push(bookresponse);
      }, errorResponse => {
        console.log('Book Store Error');
        
      });
      
    }else{
      this.toastr.error('Book already exists!');
    }
    
  }

  getBooks(){
    this.bookService.getBooks().subscribe( res => {
      this.allbooks = res;
    });
  }

  updateBook(){
    console.log(this.selectedbook);
    this.restangular.one('books',this.selectedbook.id).patch(this.selectedbook).subscribe( res => {
      this.toastr.success('Book successfully updated!');
      this.allbooks.splice(this.allbooks.indexOf(this.basebook),1, res);
    });
  }

  borrowBook(book){
    let data = {
      user_id : localStorage.getItem('user_id'),
      book_id : book.id
    }
    // this.bookService.borrow(data);
    this.restangular.all('bookborrow').post(data).subscribe(res => {
      this.toastr.success('Book successfully borrowed!');
      this.allbooks.splice(this.allbooks.indexOf(book),1);
    });
  }

  deleteBook(book){
  
    this.restangular.one('books',book.id).remove().subscribe(res => {
      this.allbooks.splice(this.allbooks.indexOf(book),1);
      this.toastr.success('Book successfully deleted!');
    }); 
  }

  restoreBook(book){
    
  }

  getAuthors(){
    this.authorService.getAuthors().subscribe( res => {
      this.allauthors = res;
    });
  }

  getGenres(){
    this.genreService.getGenres().subscribe(res => {
      this.allgenres = res;
    });
  }

  getShelves(){
    this.shelveService.getShelves().subscribe(res => {
      this.allshelves = res;
    });
  }


}
