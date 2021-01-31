import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {Message} from './message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string = "";
  isRegistered: boolean = false;

  constructor(private socket: Socket) { }


  //User handling

  registerUser(username: string): boolean{
    return this.socket.emit('register', username);
  }

  registerResponse(): Observable<boolean>{
    return this.socket.fromEvent<boolean>('registerResponse');
  }

  unregisterUser(username: string): boolean{
    return this.socket.emit('unregister', username);
  }

  listenForRegister(): Observable<string>{
    return this.socket.fromEvent<string>('userJoin');
  }

  listenForUnregister(): Observable<string>{
    return this.socket.fromEvent<string>('userLeave');
  }

  handleUserRequest(): void{
    this.socket.emit('requestUsers');
  }

  handleUserResponse(): Observable<string[]>{
    return this.socket.fromEvent<string[]>('responseUsers');
  }

  //Message handling

  sendMessage(message: Message): void{
    this.socket.emit('message', message);
  }

  listenForMessages(): Observable<Message>{
    return this.socket.fromEvent<Message>('messages');
  }


  //Typing status

  sendTypingStatus(user: string, typing: boolean): void{
    this.socket.emit('typing', {user: user, typing: typing});
  }

  listenForTyping(): Observable<string[]>{
    return this.socket.fromEvent<string[]>('typers');
  }





}
