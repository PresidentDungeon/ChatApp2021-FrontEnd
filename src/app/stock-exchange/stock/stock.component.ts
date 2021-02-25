import {Component, OnInit, TemplateRef} from '@angular/core';
import {StockService} from '../shared/stock.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Stock} from '../shared/stock';
import {faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons';
import {Filter} from '../../shared/filter';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  circleLeft = faChevronCircleLeft;
  selectedStock: Stock;

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
    price: new FormControl('', [Validators.required, Validators.min(0), Validators.maxLength(999999)]),
  });

  loading: boolean = true;
  error: string = '';
  unsubscriber$ = new Subject();

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 10;
  smallNumPages: number = 0;

  stock: Stock[];

  modalRef: BsModalRef;
  stockCreateLoading: boolean = false;
  stockCreateError: string = '';



  constructor(private stockService: StockService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getStock();

    this.stockService.getCreateResponse().pipe(takeUntil(this.unsubscriber$)).
      subscribe((data: any) => {
        if(data.created){this.modalRef.hide(); this.stockCreateError = ''; this.createForm.reset();}
        else{this.stockCreateError = data.errorMessage;}
      this.stockCreateLoading = false;
    })

    this.stockService.listenForChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {console.log("Executed"); this.getStock();})
  }


  getStock(): void{

    const filter: Filter = {currentPage: this.currentPage, itemsPrPage: this.itemsPrPage}

    this.stockService.getStock(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.stock = FilterList.list;
    }, error => {this.error = error.error}, () => {this.loading = false; });
  }

  selectStock(stock: Stock){
    console.log("Selected stock", stock);
    this.selectedStock = stock;
  }

  createStock(): void{

    this.stockCreateLoading = true;
    const stockData = this.createForm.value;

    const stock: Stock = {
      id: 0,
      name: stockData.name,
      description: stockData.description,
      currentStockPrice: stockData.price,
      dailyStockPrice: stockData.price,
      dailyTimestamp: new Date()
    }

    this.stockService.createStock(stock);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
