import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookService } from '../services/book/book.service';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  continue = true;
  allbooks;
  dataTable: any;
  user = localStorage.getItem('user_name');
  constructor(
    private bookService: BookService,
    private restangular: Restangular,
    private toastr: ToastrService,
    private chRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getBooks(localStorage.getItem('user_id'));
  }

  getBooks(id){
    this.bookService.getBorrowed(id).subscribe( res => {
      this.allbooks = res;
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable();
    });
  }

  returnBook(book){
    let data = {
    user_id : localStorage.getItem('user_id'),
    book_id : book.id
    }
    this.continue = false;
    this.restangular.all('bookreturn').post(data).subscribe(res => {
      this.toastr.success('Book successfully returned!');
      this.allbooks.splice(this.allbooks.indexOf(book),1);
      this.continue = true;
    });
    
  }

}
