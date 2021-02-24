import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {Message} from './message';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/user';
import {SocketChatApp} from '../../shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  isOnActiveChat: boolean = false;
  newMessages: number = 0;

  constructor(private socket: SocketChatApp, private http: HttpClient) {
  }

  //Message handling

  sendMessage(message: Message): void{
    this.socket.emit('message', message);
  }

  listenForMessages(): Observable<Message>{
    return this.socket.fromEvent<Message>('messages');
  }

  getAllMessages(user: User): Observable<Message[]>{
    return this.http.post<Message[]>(environment.apiUrl + '/chat', user);
  }

  //Typing status

  sendTypingStatus(user: User, typing: boolean): void{
    this.socket.emit('typing', {user: user, typing: typing});
  }

  listenForTyping(): Observable<User[]>{
    return this.socket.fromEvent<User[]>('typers');
  }

}
