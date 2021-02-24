import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock/stock.component';
import {SharedModule} from '../shared/shared.module';
import {StockExchangeRoutingModule} from './stock-exchange-routing.module';
import {FormsModule} from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    SharedModule,
    StockExchangeRoutingModule,
    FormsModule,
    PaginationModule.forRoot()
  ]
})
export class StockExchangeModule { }
