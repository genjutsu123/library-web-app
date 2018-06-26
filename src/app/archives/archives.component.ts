import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ToastrService } from 'ngx-toastr';
import { BookService } from '../services/book/book.service';
import { AuthorService } from '../services/author/author.service';
import { GenreService } from '../services/genre/genre.service';
import { ShelveService } from '../services/shelve/shelve.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
import { Book } from '../models/book.model';
import { Author } from '../models/Author.model';
import { Genre } from '../models/Genre.model';
import { Shelve } from '../models/Shelve.model';
@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css']
})
export class ArchivesComponent implements OnInit {
  dataTable: any;
  allbooks:Book[];
  allauthors:Author[];
  allgenres:Genre[];
  allshelves:Shelve[];
  role;
  continue = true;
  constructor(
    private restangular: Restangular,
    private toastr: ToastrService,
    private bookService: BookService,
    private genreService: GenreService,
    private authorService: AuthorService,
    private shelveService: ShelveService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getArchives();
    this.role = localStorage.getItem('user_role');
  }

  spawnTable(){
    this.chRef.detectChanges();
    const table: any = $('table');
    this.dataTable = table.DataTable();
  }

  getArchives(){
    this.bookService.getDeleted().subscribe(res => {
      this.allbooks = res;

      this.shelveService.getDeleted().subscribe(res => {
        this.allshelves = res;

        this.authorService.getDeleted().subscribe(res => {
          this.allauthors = res;

          this.genreService.getDeleted().subscribe(res => {
            this.allgenres = res;

            this.spawnTable();

          });

        });

      });

    });
  }

  restoreAuthor(author){
    this.continue = false;
    let data = {
      id: author.id
    };
    this.restangular.all('authorrestore').post(data).subscribe(res => {
      
      this.spawnTable();
    }, error => {
      
    }, () => {
      this.allauthors.splice(this.allauthors.indexOf(author),1);
      this.toastr.success('Author Successfully Restored!');
      this.continue = true;
    });
  }

  restoreBook(book){
    this.continue = false;
    let data = {
      id: book.id
    };
    this.restangular.all('bookrestore').post(data).subscribe(res => {
      
      this.spawnTable();
    }, error => {
      
    }, () => {
      this.allbooks.splice(this.allbooks.indexOf(book),1);
      this.toastr.success('Book Successfully Restored!');
      this.continue = true;
    });
  }

  restoreGenre(genre){
    this.continue = false;
    let data = {
      id: genre.id
    };
    this.restangular.all('genrerestore').post(data).subscribe(res => {
      
      this.spawnTable();
    }, error => {
      
    }, () => {
      this.allgenres.splice(this.allgenres.indexOf(genre),1);
      this.toastr.success('Genre Successfully Restored!');
      this.continue = true;
    });
  }

  restoreShelve(shelve){
    this.continue = false;
    let data = {
      id: shelve.id
    };
    this.restangular.all('shelverestore').post(data).subscribe(res => {
      
      this.spawnTable();
    }, error => {
      
    }, () => {
      this.allshelves.splice(this.allshelves.indexOf(shelve),1);
      this.toastr.success('Shelve Successfully Restored!');
      this.continue = true;
    });
  }


}
