import { Component, OnInit } from '@angular/core';
import {StockService} from '../shared/stock.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Stock} from '../shared/stock';
import {faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons';
import {Filter} from '../../shared/filter';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  circleLeft = faChevronCircleLeft;
  selectedStock: Stock;

  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
  });

  loading: boolean = true;
  error: string = '';
  unsubscriber$ = new Subject();

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 10;
  smallNumPages: number = 0;

  stock: Stock[];

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.getStock()
  }


  getStock(): void{

    const filter: Filter = {currentPage: this.currentPage, itemsPrPage: this.itemsPrPage}
    this.loading = true;

    this.stockService.getStock(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.stock = FilterList.list;
    }, error => {this.error = error.error}, () => {this.loading = false; });
  }




  selectStock(stock: Stock){
    console.log("Selected stock", stock);
    this.selectedStock = stock;
  }

  itemsPrPageUpdate(): void{
    this.smallNumPages = Math.ceil(this.totalItems / this.itemsPrPage);
    this.currentPage = 1;
    this.getStock();
  }

  pageChanged($event: any): void {
    if ($event.page !== this.currentPage){
      this.currentPage = $event.page;
      this.getStock();
    }
  }


}
