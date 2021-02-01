import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {Message} from './message';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string = "";
  isRegistered: boolean = false;

  constructor(private socket: Socket, private http: HttpClient) {
  }

  registerUser(username: string): Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/user/register', {username: username});
  }

  unregisterUser(username: string): boolean {
    return this.socket.emit('unregister', username);
  }

  getConnectedUsers(): Observable<string[]>{
    return this.http.get<string[]>(environment.apiUrl + '/user');
  }



  //User handling

  listenForRegister(): Observable<string>{
    return this.socket.fromEvent<string>('userJoin');
  }

  listenForUnregister(): Observable<string>{
    return this.socket.fromEvent<string>('userLeave');
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
