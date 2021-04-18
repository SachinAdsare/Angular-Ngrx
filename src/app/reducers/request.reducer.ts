import { Action } from '@ngrx/store'
import { request } from './../models/request.model'

import * as RequestActions from '../actions/request.actions'

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';


export interface RequestState extends EntityState<request> {

}

export const adapter : EntityAdapter<request> =
  createEntityAdapter<request>({
  });

const initialState: request = <request>{}


export const initialRequestState: RequestState = adapter.getInitialState();


export function requestReducers(state = initialRequestState, action: RequestActions.Actions ) {

  switch(action.type) {
    case RequestActions.ADD_request:
      return adapter.addOne(action.payload, state);

    case RequestActions.UPDATE_request:

      if (state.entities[action.id] === undefined) {
        return state;
      }

      console.log('xxxxxxxxxxxx');
      console.log(action.id);
      console.log(action.changes);

      return  adapter.updateOne({
        id: action.id,
        changes: action.changes
      }, state)

    case RequestActions.REMOVE_request:
      return  adapter.removeOne(action.id, state)
    default:
      return state;
  }
}

export const getRequestState = createFeatureSelector<RequestState>('requests');


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors(getRequestState);
