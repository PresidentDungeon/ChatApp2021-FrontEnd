import { Component, OnInit } from '@angular/core';
import {StockService} from '../shared/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.getConnectedUsersAmount().subscribe(() => {});
  }

}
