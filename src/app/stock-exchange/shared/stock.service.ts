import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Socket} from 'ngx-socket-io';
import {HttpClient} from '@angular/common/http';
import {SocketStockExchange} from '../../shared/shared.module';
import {Filter} from '../../shared/filter';
import {Stock} from './stock';
import {FilterList} from '../../shared/filterList';
import {User} from '../../shared/user';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStockExchange, private http: HttpClient) { }

  getStock(filter: Filter): Observable<FilterList<Stock>>{
    return this.http.post<FilterList<Stock>>(environment.apiUrlStock + '/stock', filter);
  }

  createStock(stock: Stock): void{
    this.socket.emit('createStock', stock);
  }

  updateStock(stock: Stock): void{
    this.socket.emit('updateStock', stock);
  }

  getCreateResponse(): Observable<any>{
    return this.socket.fromEvent<any>('createResponse');
  }

  getUpdateResponse(): Observable<any>{
    return this.socket.fromEvent<any>('updateResponse');
  }

  listenForCreateChange(): Observable<any>{
    return this.socket.fromEvent<any>('stockCreateChanged');
  }

  listenForUpdateChange(): Observable<Stock>{
    return this.socket.fromEvent<Stock>('stockUpdateChanged');
  }

}
