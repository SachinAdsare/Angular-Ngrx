import { Injectable } from '@angular/core';

import * as RequestActions from '../actions/request.actions'

import * as fromRequestReducer from './../reducers/request.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { request } from './../models/request.model'


@Injectable()
export class RequestService {

    private allRequests;
    private requestById;
    constructor (private store: Store<AppState> ) {


      this.allRequests = createSelector(
        fromRequestReducer.selectAll,
        (entities) => {
          return entities;
        }
      )

      this.requestById = createSelector(fromRequestReducer.selectEntities,
        (entities: Dictionary<request>, props: {id: number}) => {
          return entities[props.id];
        }
      )

    }

    public add(data: request) {

      this.store.dispatch(new RequestActions.AddRequest(data) )
    }


    public list() {
      return this.store.pipe(select(this.allRequests));
    }

    public remove(id: number) {
      this.store.dispatch(new RequestActions.RemoveRequest(id))
    }

    public getDetail(id: number) {
      return this.store.pipe(select(this.requestById, {id: id}));
    }

    public edit(id: number, changes: request) {
      this.store.dispatch(new RequestActions.UpdateRequest(id, changes))
    }
}
