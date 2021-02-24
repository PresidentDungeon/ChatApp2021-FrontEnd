import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Socket} from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';
import {SocketStockExchange} from '../../shared/shared.module';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStockExchange, private http: HttpClient) { }

  getConnectedUsersAmount(): Observable<number>{
    return this.http.get<number>(environment.apiUrl + '/user/amount');
  }
}
