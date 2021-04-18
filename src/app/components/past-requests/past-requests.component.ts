import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs';

import { RequestService } from './../../services/request.service';
import { request } from './../../models/request.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-past-requests',
  templateUrl: './past-requests.component.html',
  styleUrls: ['./past-requests.component.css']
})
export class PastRequestsComponent implements OnInit {
  public requests: Observable<request>;
  count=0;

  @Output() loadRequest = new EventEmitter();
  @Output() deletedRequested = new EventEmitter();
  constructor(private toastr: ToastrService, private requestService:RequestService) {

  }

  ngOnInit() {
    this.requests = this.requestService.list();
  }

  load(req: any) {
    this.loadRequest.emit(req);
  }

deleteRecord(id) {
  this.deletedRequested.emit(id)
  this.requestService.remove(id);
  this.toastr.success("Request Deleted Successfully.")
}
}
