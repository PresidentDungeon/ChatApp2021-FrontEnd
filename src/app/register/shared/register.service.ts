import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {User} from '../../shared/user';
import {Message} from '../../chat/shared/message';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  user: User = null;
  isRegistered: boolean = false;

  constructor(private socket: Socket, private http: HttpClient) { }

  registerUser(user: User): void{
    this.socket.emit('register', user);
  }

  unregisterUser(): void{
    this.socket.emit('unregister');
  }

  getConnectedUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.apiUrl + '/user');
  }

  searchExistingUser(user: User): Observable<boolean>{
     return this.http.post<boolean>(environment.apiUrl + '/user', {user: user});
  }

  getRegisterResponse(): Observable<any>{
    return this.socket.fromEvent<any>('registerResponse');
  }

  listenForRegister(): Observable<User>{
    return this.socket.fromEvent<User>('userJoin');
  }

  listenForUnregister(): Observable<User>{
    return this.socket.fromEvent<User>('userLeave');
  }
}
