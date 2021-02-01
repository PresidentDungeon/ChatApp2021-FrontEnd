import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  username: string = "";
  isRegistered: boolean = false;

  constructor(private socket: Socket, private http: HttpClient) { }

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
}
