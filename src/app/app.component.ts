import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiParamsComponent } from './components/api-params/api-params.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(ApiParamsComponent, { static: true }) apiParams: ApiParamsComponent;



  constructor() {
  
  }

  ngOnInit() {

  }

  loadRequestHandler(request: any) {
    this.apiParams.loadPastRequest(request);
  }

  deletedRequest(id:number){
    this.apiParams.checkDeletedRequest(id);
  }



}
