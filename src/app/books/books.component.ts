import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthorService } from '../services/author/author.service';
import { BookService } from '../services/book/book.service';
import { GenreService } from '../services/genre/genre.service';
import { ShelveService } from '../services/shelve/shelve.service';
import { Restangular } from 'ngx-restangular';
import { AuthService } from '../services/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Author } from '../models/Author.model';
import { Book } from '../models/Book.model';
import { Genre } from '../models/Genre.model';
import { Shelve } from '../models/Shelve.model';
import { NewBook } from '../models/NewBook.model';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';



@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  dataTable: any;
  modalRef: BsModalRef;
  role;
  allborrowedbooks = [];
  allbooks;
  allauthors;
  allgenres;
  allshelves;
  author:Author;
  selectedbook:Book;
  newbook:NewBook;
  book: Book;
  continue = true;
  basebook:Book;

  constructor(private authorService:AuthorService,
              private bookService:BookService,
              private genreService:GenreService,
              private shelveService:ShelveService,
              private toastr: ToastrService,
              private restangular: Restangular,
              private authService: AuthService,
              private chRef: ChangeDetectorRef,
              private modalService: BsModalService
  ) { }
  
  ngOnInit() {
    this.getBooks();
    this.getAuthors();
    this.getGenres();
    this.getShelves();
    this.getBorrowedBooks();
    this.role = this.authService.role();
    
  }

  clearBook(){
 
  }

  openModal(template: TemplateRef<any>) {
    this.book = new Book();
    this.newbook = new NewBook();
    this.modalRef = this.modalService.show(template);
  }

  spawnTable() {
    this.chRef.detectChanges();
    const table: any = $('table');
    this.dataTable = table.DataTable();
  }

  matchBook(name) {
    for (let book of this.allbooks) {
      if(book.name == name){
        this.toastr.error('Book already exists!');
        return true;
      }
    }
    return false;
  }

  matchBorrowed(id: number) {
    for(let book of this.allborrowedbooks) {
      
      if(book == id) {
        
        return true;
      }
    }
    
    return false;
  }

  selectBook(book) {    
    this.selectedbook = book;
    this.basebook = book;
  }

  storeBook() {
    this.continue = false;
    if(!this.matchBook(this.newbook.name) && this.newbook.stock > 0){
      this.restangular.all('books').post(this.newbook).subscribe( bookresponse => {
        this.toastr.success('Book Successfully Stored');
        this.allbooks.push(bookresponse);
      }, errorResponse => this.continue = true, 
      () => this.continue = true);  
    }else {
      this.toastr.error('Book data error!');
      this.continue = true;
    }
  }

  getBooks() {
    this.bookService.getBooks()
    .subscribe((res: Book[]) => {
      this.allbooks = res;
      this.spawnTable();
    });
  }

  updateBook() {
    this.continue = false;
    this.restangular.one('books',this.selectedbook.id).patch(this.selectedbook)
    .subscribe(res => {
      this.toastr.success('Book successfully updated!');
      this.allbooks.splice(this.allbooks.indexOf(this.basebook),1, res);
    }, error => this.continue = true,
     () => this.continue = true);
  }

  borrowBook(book) {
    this.continue = false;

    let data = {
      user_id : localStorage.getItem('user_id'),
      book_id : book.id
    }

    if(!this.matchBorrowed(data.book_id)){
      
      this.restangular.all('bookborrow').post(data).subscribe(res => {
        this.toastr.success('Book successfully borrowed!');
        if(res.stock > 1) {
          this.allbooks.splice(this.allbooks.indexOf(book),1, res);
        }else {
          this.allbooks.splice(this.allbooks.indexOf(book),1);
        }
        this.allborrowedbooks.push(res.id);
        this.spawnTable();
        console.log(this.allborrowedbooks);
        
      }, error => this.toastr.error(error.data),
      () => this.continue = true);
    }else {
      this.toastr.error('You already borrowed that book');
      this.continue = true;
    }
  }

  deleteBook(book) {
    this.continue = false;
    this.restangular.one('books',book.id).remove().subscribe(res => {
      
    }, () =>{
      this.continue = true;
    }, () =>{
      this.allbooks.splice(this.allbooks.indexOf(book),1);
      this.toastr.success('Book successfully deleted!');
      this.continue = true;
    }); 
  }

  getBorrowedBooks() {    
    this.bookService.getBorrowed(localStorage.getItem('user_id')).subscribe( res => {
      res.forEach(element => {
        
        this.allborrowedbooks.push(element.id);
           
      });
    }, ()=>{});
    
  }

  getAuthors() {
    this.authorService.getAuthors().subscribe((res: Author[]) => {
      this.allauthors = res;
    });
  }

  getGenres() {
    this.genreService.getGenres().subscribe((res: Genre[]) => {
      this.allgenres = res;
    });
  }

  getShelves() {
    this.shelveService.getShelves().subscribe((res: Shelve[]) => {
      this.allshelves = res;
    });
  }
}
