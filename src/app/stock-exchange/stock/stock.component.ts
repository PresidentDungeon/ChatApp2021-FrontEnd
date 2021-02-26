import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
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
export class StockComponent implements OnInit, OnDestroy {

  circleLeft = faChevronCircleLeft;
  selectedStock: Stock;

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
    price: new FormControl('', [Validators.required, Validators.min(0), Validators.maxLength(999999)]),
  });

  updateForm = new FormGroup({
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
  stockUpdateLoading: boolean = false;
  stockUpdateError: string = '';
  stockSelectedUpdated: boolean = false;


  constructor(private stockService: StockService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getStock();

    this.stockService.getCreateResponse().pipe(takeUntil(this.unsubscriber$)).
      subscribe((data: any) => {
        if(data.created){this.modalRef.hide(); this.stockCreateError = ''; this.createForm.reset();}
        else{this.stockCreateError = data.errorMessage;}
      this.stockCreateLoading = false;
    })

    this.stockService.getUpdateResponse().pipe(takeUntil(this.unsubscriber$)).
    subscribe((data: any) => {
      if(data.updated){this.modalRef.hide(); this.stockUpdateError = '';}
      else{this.stockUpdateError = data.errorMessage;}
      this.stockUpdateLoading = false;
    })

    this.stockService.listenForCreateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getStock();})

    this.stockService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((stock) => {this.getStock(); if(this.selectedStock && this.selectedStock.id){this.selectedStock = stock; this.stockSelectedUpdated = true;}})
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  getStock(): void{

    const filter: Filter = {currentPage: this.currentPage, itemsPrPage: this.itemsPrPage}

    this.stockService.getStock(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.stock = FilterList.list;
    }, error => {this.error = error.error}, () => {this.loading = false; });
  }

  selectStock(stock: Stock){
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

  updateStock(): void{

    this.stockUpdateLoading = true;
    const stockData = this.updateForm.value;

    const stock: Stock = {
      id: this.selectedStock.id,
      name: stockData.name,
      description: stockData.description,
      currentStockPrice: stockData.price,
      dailyStockPrice: this.selectedStock.dailyStockPrice,
      dailyTimestamp: this.selectedStock.dailyTimestamp
    }

    this.stockService.updateStock(stock);
  }

  openModalCreate(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModalUpdate(template: TemplateRef<any>) {
    this.updateForm.patchValue({
      name: this.selectedStock.name,
      description: this.selectedStock.description,
      price: this.selectedStock.currentStockPrice
    });
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
