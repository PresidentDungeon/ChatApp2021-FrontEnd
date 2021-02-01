import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {Message} from './message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {



  constructor(private socket: Socket) {
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
