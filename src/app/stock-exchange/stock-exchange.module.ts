import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock/stock.component';
import {SharedModule} from '../shared/shared.module';
import {StockExchangeRoutingModule} from './stock-exchange-routing.module';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    SharedModule,
    StockExchangeRoutingModule,
  ]
})
export class StockExchangeModule { }
