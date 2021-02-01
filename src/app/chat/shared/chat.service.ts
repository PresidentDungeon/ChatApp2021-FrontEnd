import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {Message} from './message';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket, private http: HttpClient) {
  }

  //Message handling

  sendMessage(message: Message): void{
    this.socket.emit('message', message);
  }

  listenForMessages(): Observable<Message>{
    return this.socket.fromEvent<Message>('messages');
  }

  getAllMessages(): Observable<Message[]>{
    return this.http.get<Message[]>(environment.apiUrl + '/chat');
  }


  //Typing status

  sendTypingStatus(username: string, typing: boolean): void{
    this.socket.emit('typing', {user: username, typing: typing});
  }

  listenForTyping(): Observable<string[]>{
    return this.socket.fromEvent<string[]>('typers');
  }





}
