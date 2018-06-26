import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ShelveService } from "../services/shelve/shelve.service";
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-responsive-bs4';
import { Shelve } from '../models/Shelve.model';
@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.css']
})
export class ShelvesComponent implements OnInit {
  modalRef: BsModalRef;
  continue = true;
  role;
  dataTable: any;
  selectedshelve;
  allshelves;
  shelve = {
    name: ""
  };
  updateshelve: Shelve;
  constructor(private shelveService: ShelveService, 
              private restangular: Restangular,
              private toastr: ToastrService,
              private authService: AuthService,
              private chRef: ChangeDetectorRef,
              private modalService: BsModalService
  ) { }
  

  ngOnInit() {
    this.getShelves();
    this.role = this.authService.role();
  }

  openModal(template: TemplateRef<any>) {
    this.shelve = new Shelve();
    this.modalRef = this.modalService.show(template);
  }

  matchShelve(name){
    for (let author of this.allshelves) {
      if(author.name == name){
        this.toastr.error('Shelve already exists!');
        this.continue = true;
        return true;

      }
    }
    return false;
  }
  

  getShelves(){

    this.shelveService.getShelves().subscribe(res => {
      this.allshelves = res;
      this.chRef.detectChanges();
      const table: any = $('table');
      this.dataTable = table.DataTable();
    });
  
  }

  selectShelve(data){
    this.updateshelve = data;
    this.selectedshelve = data;
  }

  storeShelve(){
    this.continue = false;
    if(!this.matchShelve(this.shelve.name)){
      console.log(this.shelve.name);
      this.restangular.all('shelves').post(this.shelve).subscribe( shelveresponse => {
        console.log('Shelve Store Success');
        this.toastr.success('Shelve successfully added!');

        this.restangular.one('shelves', shelveresponse.id).get().subscribe( lastshelveresponse => {
          this.allshelves.push(lastshelveresponse);
          this.continue = true;
        });

      }, errorResponse => {
        console.log('Shelve Store Error');
      });
    }

  }

  updateShelve(){
    this.continue = false;
    this.restangular.one('shelves',this.updateshelve.id).patch(this.updateshelve).subscribe( res => {
      this.restangular.one('shelves',res.id).get().subscribe( res => {
        this.toastr.success('Shelve successfully updated!');
        this.allshelves.splice(this.allshelves.indexOf(this.selectedshelve),1, res);
        this.continue = true;
      });
    });
  }

  deleteShelve(data){
    this.continue = false;
    this.restangular.one('shelves',data.id).remove().subscribe(res => {
      this.allshelves.splice(this.allshelves.indexOf(data),1);
      this.toastr.success('Shelve successfully deleted!');
      this.continue = true;
    });
  }

  private shelves(): Observable<any> {
    return this.restangular.all('shelves').getList();
  }
}
