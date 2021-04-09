import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock/stock.component';
import {SharedModule} from '../shared/shared.module';
import {StockExchangeRoutingModule} from './stock-exchange-routing.module';
import {FormsModule} from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import {NgxsModule} from '@ngxs/store';
import {ChatState} from '../chat/state/chat.state';
import {StockState} from './state/stock.state';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    SharedModule,
    StockExchangeRoutingModule,
    FormsModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    NgxsModule.forFeature([StockState])


  ]
})
export class StockExchangeModule { }

