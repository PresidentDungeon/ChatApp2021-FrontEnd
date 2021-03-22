import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SocketStockExchange} from '../../shared/shared.module';
import {Filter} from '../../shared/filter';
import {Stock} from './stock';
import {FilterList} from '../../shared/filterList';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private socket: SocketStockExchange, private http: HttpClient) { }

  getStock(filter: Filter): Observable<FilterList<Stock>>{
    return this.http.post<FilterList<Stock>>(environment.apiUrlStock + '/stock', filter);
  }

  getStockByID(ID: string): Observable<Stock>{
    return this.http.get<Stock>(environment.apiUrlStock + '/stock/?ID=' + ID);
  }

  createStock(stock: Stock): void{
    this.socket.emit('createStock', stock);
  }

  updateStock(stock: Stock): void{
    this.socket.emit('updateStock', stock);
  }

  deleteStock(stock: Stock): void{
    this.socket.emit('deleteStock', stock);
  }

  verifyStockInitial(): void{
    this.socket.emit('verifyStockInitial');
  }

  getCreateResponse(): Observable<any>{
    return this.socket.fromEvent<any>('createResponse');
  }

  getUpdateResponse(): Observable<any>{
    return this.socket.fromEvent<any>('updateResponse');
  }

  getDeleteResponse(): Observable<any>{
    return this.socket.fromEvent<any>('deleteResponse');
  }

  listenForCreateChange(): Observable<any>{
    return this.socket.fromEvent<any>('stockCreateChanged');
  }

  listenForUpdateChange(): Observable<Stock>{
    return this.socket.fromEvent<Stock>('stockUpdateChanged');
  }

  listenForDeleteChange(): Observable<Stock>{
    return this.socket.fromEvent<Stock>('stockDeleteChanged');
  }

  listenForDailyUpdate(): Observable<any>{
    return this.socket.fromEvent<any>('stockDailyUpdate');
  }

}
