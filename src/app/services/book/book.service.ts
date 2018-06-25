import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor( private restangular: Restangular, private toastr: ToastrService, private authService: AuthService) { }
  book:any;
  role;
  getBooks(){
    // if(localStorage.getItem('user_role') == "1"){
    //   return this.restangular.all('booklibrarian').getList();
    // }else{
    //   return this.restangular.all('books').getList();
    // }
    return this.restangular.all('books').getList();
  }
  store(book) {
    
    console.log('RUNNING STORE:',book);
    return this.restangular.all('books').post(book).subscribe( bookresponse => {
      console.log('Book Store Success');
      this.toastr.success('Book Successfully Stored');
      this.book = bookresponse;
    }, errorResponse => {
      console.log('Book Store Error');
      
    });
   
    
  }
  borrow(data){
    console.log('Borrow:',data);
    this.restangular.all('bookborrow').post(data);
  }

  return(data){
    console.log('Return:',data);
    this.restangular.all('bookreturn').post(data);
  }

  getBorrowed(id){
    return this.restangular.one('bookborrow',id).get();
  }

  getDeleted(){
    return this.restangular.all('booksdeleted').getList();
  }
  getLast(){
    return this.restangular.one('bookslast').getList();
  }
  

}
