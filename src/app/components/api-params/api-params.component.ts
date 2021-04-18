import { Component, OnInit, Input, Output, EventEmitter ,ElementRef, ViewChild, } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { request } from './../../models/request.model';
import { RequestService } from './../../services/request.service';
import { ToastrService } from 'ngx-toastr';
// import { addRequest } from 'src/app/request.actions';
@Component({
  selector: 'app-api-params',
  templateUrl: './api-params.component.html',
  styleUrls: ['./api-params.component.css']
})
export class ApiParamsComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() openIDBrequest: any;
  @Input() indexedDB: any;
  @Output() newRequest = new EventEmitter();

  endpoint: string;
  selectedRequestMethod: string;
  readonly requestMethods: Array<string>;
  responseData: any;
  responseError: any;
  savedRequestCount: number;
  requestBody: any;
  requestBodyDataTypes: any;
  readonly availableDataTypes: any;
  requestHeaders: any;
  endpointError: string;
  loadingState: boolean;
  isEdit=false;
  requestId: number;
  saveAs=false;

  constructor(private toastr: ToastrService,private _mainService: MainService,private requestService:RequestService) {
    this.endpoint = '';
    this.selectedRequestMethod = 'GET';
    this.requestMethods = [
      'GET',
      'POST',
      'PUT',
      'DELETE'
    ];
    this.availableDataTypes = [
      'String',
      'Number',
      'Boolean'
    ];
    this.requestBody = [{ key: '', value: '' }];
    this.requestBodyDataTypes = [''];
    this.requestHeaders = [{ key: 'Content-Type', value: 'application/json' }];
    this.endpointError = '';
    this.loadingState = false;
  }

  ngOnInit() {}

  addItem(ctx: string) {
    let context;
    if (ctx === 'Body') {
      context = this.requestBody;
    } else if (ctx === 'Headers') {
      context = this.requestHeaders;
    }

    context.push({ key: '', value: '' });
    if (ctx === 'Body') {
      this.requestBodyDataTypes.push('');
    }
    this.scrollToBottom();
  }

  isAddDisabled(ctx: string) {
    let context;
    if (ctx === 'Body') {
      context = this.requestBody;
    } else if (ctx === 'Headers') {
      context = this.requestHeaders;
    }

    if (context.length > 0) {
      if (context[context.length - 1].key === '' ||
        context[context.length - 1].value === ''
      ) {
        return true;
      }
    }

    return false;
  }

  removeItem(index: number, ctx: string) {
    let context;
    if (ctx === 'Body') {
      context = this.requestBody;
    } else if (ctx === 'Headers') {
      context = this.requestHeaders;
    }

    context.splice(index, 1);
  }

  // saveRequest(requestType: string) {


    addRequest(){

    const  request = <request>{};
    request.endpoint =this.endpoint;
    request.method = this.selectedRequestMethod;
    request.headers = this.constructObject('Headers');
    request.body = this.constructObject('Body');
    if(this.isEdit && !this.saveAs){
     this.requestService.edit(this.requestId,request);
    }
    else {
      request.id = new Date().getTime();
      if(!this.requestId){
      this.requestId=request.id;
      }
      this.isEdit=true;
     this.requestService.add(request);
    }
    this.saveAs=false;
  this.toastr.success("Request saved Successfully.");
  }

  loadPastRequest(request: any) {
    this.isEdit=true;
    this.requestId=request.id;
    this.selectedRequestMethod = request.method;
    this.endpoint = request.endpoint;
    this.requestHeaders = this.deconstructObject(request.headers, 'Headers');
    if (request.method === 'POST' || request.method === 'PUT') {
      this.requestBody = this.deconstructObject(request.body, 'Body');
    }
  }
  checkDeletedRequest(id){
    if(id==this.requestId){
      this.createNewRequest();
    }

  }
  deconstructObject(object: any, type: string) {
    const objectArray = [];

    switch (type) {
      case 'Body': {
        Object.keys(object).forEach((objKey, index) => {
          this.requestBodyDataTypes[index] = 'String';
          const obj = { key: objKey, value: '' };
          objectArray.push(obj);
        });
        break;
      }
      case 'Headers': {
        Object.keys(object).forEach(objKey => {
          const obj = { key: objKey, value: object[objKey] };
          objectArray.push(obj);
        });
        break;
      }
    }

    return objectArray;
  }

  validateUrl(text: string) {
    // tslint:disable-next-line: max-line-length
    const urlRegExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return urlRegExp.test(text);
  }

  constructObject(ctx: string) {
    let context;
    if (ctx === 'Body') {
      context = this.requestBody;
    } else if (ctx === 'Headers') {
      context = this.requestHeaders;
    }

    let constructedObject = {};
    constructedObject
      = context
        .reduce((object, item) => {
          object[item.key] = item.value;
          return object;
        }, {});
    return constructedObject;
  }

  sendRequest() {
    this.endpointError = '';
    this.responseData = '';
    this.responseError = '';

    if (!this.endpoint) {
      // this.toastr.error('Endpoint is a Required value', '', {
      //   timeOut: 3000,
      // });
      this.toastr.error('Endpoint is a Required value', '');
    //  this.endpointError = 'Endpoint is a Required value';
      return;
    }
    if (!this.validateUrl(this.endpoint)) {
      this.endpointError = 'Please enter a valid URL';

      this.toastr.error('Please enter a valid URL', '');
      return;
    }

    this.requestBody.forEach((item, index) => {
      if (this.requestBodyDataTypes[index] === 'Number') {
        item = Number(item);
      }
    });

    this.loadingState = true;
    switch (this.selectedRequestMethod) {
      case 'GET': {
        this._mainService.sendGetRequest(
          this.endpoint,
          this.constructObject('Headers')
        ).subscribe(
         ( data) => {
            this.loadingState = false;
            this.responseData = data;
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
      case 'POST': {
        this._mainService.sendPostRequest(
          this.endpoint,
          this.constructObject('Body'),
          this.constructObject('Headers')
        ).subscribe(
          data => {
            this.loadingState = false;
            this.responseData = data;
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
      case 'PUT': {
        this._mainService.sendPutRequest(
          this.endpoint,
          this.constructObject('Body'),
          this.constructObject('Headers')
        ).subscribe(
          data => {
            this.loadingState = false;
            this.responseData = data;
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
      case 'DELETE': {
        this._mainService.sendDeleteRequest(
          this.endpoint,
          this.constructObject('Headers')
        ).subscribe(
          data => {
            this.loadingState = false;
            console.log(data);
            this.responseData = data;
          },
          error => {
            this.loadingState = false;
            this.responseError = JSON.stringify(error, undefined, 4);
          }
        );
        break;
      }
    }



  }

  createNewRequest(){
    this.isEdit=false;
    this.requestId=null;
    this.selectedRequestMethod = 'GET';
    this.endpoint = '';
    this.requestBody = [{ key: '', value: '' }];
    this.requestBodyDataTypes = [''];
    this.requestHeaders = [{ key: 'Content-Type', value: 'application/json' }];
    this.endpointError = '';
  }

  scrollToBottom(): void {
    try {

         this.myScrollContainer.nativeElement.scroll({
          top: this.myScrollContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }
     catch(err) { }
}


}
