import { Injectable } from '@angular/core';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private clientIdentifier = 'userClient'
  isRegistered = false

  constructor() { }

  saveClient(client: User){
    localStorage.setItem(this.clientIdentifier, JSON.stringify(client))
  }

  getClient(): User{
    return JSON.parse(localStorage.getItem(this.clientIdentifier))
  }

}
