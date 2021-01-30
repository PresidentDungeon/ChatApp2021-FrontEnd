import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {User} from './User';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string = "";

  constructor(private socket: Socket) { }


  registerUser(username: string): boolean{
    return this.socket.emit('register', username);
  }

  unregisterUser(username: string): boolean{
    return this.socket.emit('unregister', username);
  }

  registerResponse(): Observable<boolean>{
    return this.socket.fromEvent<boolean>('registerResponse');
  }

  sendMessage(message: string): void{
    this.socket.emit('message', message);
  }

  listenForMessages(): Observable<string>{
    return this.socket.fromEvent<string>('messages');
  }

  sendTypingStatus(user: string, typing: boolean): void{
    this.socket.emit('typing', {user: user, typing: typing});
  }

  listenForTyping(): Observable<User[]>{
    return this.socket.fromEvent<User[]>('typers');
  }

}
