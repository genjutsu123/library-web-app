import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  allbooks;
  user = localStorage.getItem('user_name');
  constructor(
    private bookService: BookService,
    private restangular: Restangular,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getBooks(localStorage.getItem('user_id'));
  }

  getBooks(id){
    this.bookService.getBorrowed(id).subscribe( res => {
      this.allbooks = res;
      console.log(res);
    });
  }

  returnBook(book){
    let data = {
    user_id : localStorage.getItem('user_id'),
    book_id : book.id
  }
    // this.bookService.return(data);
    this.restangular.all('bookreturn').post(data).subscribe(res => {
      this.toastr.success('Book successfully returned!');
      this.allbooks.splice(this.allbooks.indexOf(book),1);
    });
    
  }

}
