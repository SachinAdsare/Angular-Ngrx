import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {CommonModule} from '@angular/common';
import {PastRequestsComponent} from './components/past-requests/past-requests.component';
import {ApiParamsComponent} from './components/api-params/api-params.component';
import { FoofJsonViewerModule } from 'foof-json-viewer';

import { StoreModule } from '@ngrx/store';

import { requestReducers } from './reducers/request.reducer';
import { RequestService } from './services/request.service';
import {  MatDividerModule, MatIconModule } from '@angular/material';

import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,PastRequestsComponent, ApiParamsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    FoofJsonViewerModule,
    MatTooltipModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot({
      requests: requestReducers
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 state
    }),
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
