import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {User} from '../../shared/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  user: User = null;
  isRegistered: boolean = false;

  constructor(private socket: Socket, private http: HttpClient) { }

  registerUser(user: User): Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/user/register', {user: user});
  }

  unregisterUser(user: User): boolean {
    return this.socket.emit('unregister', user);
  }

  getConnectedUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.apiUrl + '/user');
  }

  //User handling

  listenForRegister(): Observable<User>{
    return this.socket.fromEvent<User>('userJoin');
  }

  listenForUnregister(): Observable<User>{
    return this.socket.fromEvent<User>('userLeave');
  }
}
