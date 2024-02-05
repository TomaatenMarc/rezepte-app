import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  open_new_category = false;

  constructor() {}

  newCategory(){
    this.open_new_category = true;
  }

  onWillDismiss(event:any){

  }

  cancel(){
    this.open_new_category = false;
  }

}
