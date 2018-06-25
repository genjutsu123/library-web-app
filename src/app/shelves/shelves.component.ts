import { Component, OnInit } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { ShelveService } from "../services/shelve/shelve.service";
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-shelves',
  templateUrl: './shelves.component.html',
  styleUrls: ['./shelves.component.css']
})
export class ShelvesComponent implements OnInit {

  constructor( 
    private shelveService: ShelveService, 
    private restangular: Restangular,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }
  role;
  selectedshelve;
  allshelves;
  shelve = {
    name: ""
  };
  updateshelve = {
    id: "",
    name: ""
  };

  ngOnInit() {
    this.getShelves();
    this.role = this.authService.role();
  }

  matchShelve(name){
    for (let author of this.allshelves) {
      if(author.name == name){
        this.toastr.error('Shelve already exists!');
        return true;

      }
    }
    return false;
  }
  

  getShelves(){

    this.shelveService.getShelves().subscribe(res => {
      this.allshelves = res;
    });
  
  }

  selectShelve(data){
    this.updateshelve.id = data.id;
    this.updateshelve.name = data.name;
    this.selectedshelve = data;
  }

  storeShelve(){
    
    if(!this.matchShelve(this.shelve.name)){
      console.log(this.shelve.name);
      this.restangular.all('shelves').post(this.shelve).subscribe( shelveresponse => {
        console.log('Shelve Store Success');
        this.toastr.success('Shelve successfully added!');

        this.restangular.one('shelves', shelveresponse.id).get().subscribe( lastshelveresponse => {
          this.allshelves.push(lastshelveresponse);
        });

      }, errorResponse => {
        console.log('Shelve Store Error');
      });
    }

  }

  updateShelve(){
  
    this.restangular.one('shelves',this.updateshelve.id).patch(this.updateshelve).subscribe( res => {
    
      this.restangular.one('shelves',res.id).get().subscribe( res => {
        this.toastr.success('Shelve successfully updated!');
        this.allshelves.splice(this.allshelves.indexOf(this.selectedshelve),1, res);
      });
    });
  }

  deleteShelve(data){
    this.restangular.one('shelves',data.id).remove().subscribe(res => {
      this.allshelves.splice(this.allshelves.indexOf(data),1);
      this.toastr.success('Shelve successfully deleted!');
    });
  }

  private shelves(): Observable<any> {
    return this.restangular.all('shelves').getList();
  }
}
