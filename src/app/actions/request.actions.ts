import {  Injectable } from '@angular/core'
import { Action } from '@ngrx/store'
import { request } from './../models/request.model'


export const ADD_request       = '[request] Add'
export const REMOVE_request    = '[request] Remove'
export const UPDATE_request       = '[request] Update'


export class AddRequest implements Action {
  readonly type = ADD_request

  constructor(public payload: request) {

  }
}


export class UpdateRequest implements Action {
  readonly type = UPDATE_request

  constructor(public id: number,  public changes) {}
}

export class RemoveRequest implements Action {
  readonly type = REMOVE_request

  constructor(public id: number) {}
}


export type Actions = AddRequest | UpdateRequest | RemoveRequest
