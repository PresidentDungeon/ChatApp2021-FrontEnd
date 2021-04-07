import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {StockService} from '../shared/stock.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {Stock} from '../shared/stock';
import {faCheck, faChevronCircleLeft} from '@fortawesome/free-solid-svg-icons';
import {Filter} from '../../shared/filter';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {takeUntil} from 'rxjs/operators';
import {Location} from '@angular/common';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {

  circleLeft = faChevronCircleLeft;
  accept = faCheck;
  selectedStock: Stock;

  createForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(600)]),
    price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]),
  });

  updateForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(600)]),
    price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]),
  });

  stockPriceControl = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)])

  stock: Stock[];
  loading: boolean = true;
  error: string = '';
  unsubscriber$ = new Subject();

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 10;
  smallNumPages: number = 0;

  modalRef: BsModalRef;
  stockCreateLoading: boolean = false;
  stockCreateError: string = '';
  stockUpdateLoading: boolean = false;
  stockUpdateError: string = '';
  stockUpdateFromMain: boolean = false;
  stockDeleteLoading: boolean = false;
  stockDeleteError: string = '';
  stockSelectedUpdated: boolean = false;
  stockSelectedDeleted: boolean = false;
  stockDailyUpdate: boolean = false;
  stockSelectedName: string = ''


  constructor(private stockService: StockService, private modalService: BsModalService,
              private location: Location) { }

  ngOnInit(): void {

    this.initialLoad();

    this.stockService.getCreateResponse().pipe(takeUntil(this.unsubscriber$)).
      subscribe((data: any) => {
        if(data.created){this.modalRef.hide(); this.stockCreateError = ''; this.createForm.reset();}
        else{this.stockCreateError = data.errorMessage;}
      this.stockCreateLoading = false;
    })

    this.stockService.getUpdateResponse().pipe(takeUntil(this.unsubscriber$)).
    subscribe((data: any) => {

      if(this.stockUpdateFromMain){
        if(data.updated){this.error = '';}
        else{this.error = data.errorMessage;}
        this.stockUpdateFromMain = false;
      }
      else{
        if(data.updated){this.modalRef.hide(); this.stockUpdateError = '';}
        else{this.stockUpdateError = data.errorMessage;}
        this.stockUpdateLoading = false;
      }
      if(data.updated){this.getStock(); if(this.selectedStock && this.selectedStock.id === data.stock.id){this.selectedStock = data.stock; this.stockPriceControl.setValue(data.stock.currentStockPrice);}}
    })

    this.stockService.getDeleteResponse().pipe(takeUntil(this.unsubscriber$)).
    subscribe((data: any) => {
      if(data.deleted){this.modalRef.hide(); this.stockDeleteError = ''; this.getStock(); if(this.selectedStock.id === data.stock.id){this.selectedStock = undefined;}}
      else{this.stockDeleteError = data.errorMessage;}
      this.stockDeleteLoading = false;
    })

    this.stockService.listenForCreateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getStock();})

    this.stockService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((stock) => {this.getStock(); if(this.selectedStock && this.selectedStock.id === stock.id){this.selectedStock = stock; this.stockSelectedUpdated = true; this.stockPriceControl.setValue(stock.currentStockPrice)}})

    this.stockService.listenForDeleteChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((stock) => {this.getStock(); if(this.selectedStock && this.selectedStock.id === stock.id){this.selectedStock = undefined; this.stockSelectedDeleted = true;}})

    this.stockService.listenForDailyUpdate().pipe(takeUntil(this.unsubscriber$)).
    subscribe( () => {
      this.getStock(); this.stockDailyUpdate = true;
      if(this.selectedStock){
        this.stockService.getStockByID(this.selectedStock.id).subscribe((stock) => {this.selectedStock = stock; this.stockPriceControl.setValue(stock.currentStockPrice);})
      }})

  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  initialLoad(): void{
    this.stockService.verifyStockInitial();
  }

  getStock(){
    const filter: Filter = {currentPage: this.currentPage, itemsPrPage: this.itemsPrPage}
    this.stockService.getStock(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.stock = FilterList.list;
    }, error => {this.error = error.error}, () => {this.loading = false; });
  }

  selectStock(stock: Stock){
    this.selectedStock = stock;
    this.stockPriceControl.setValue(stock.currentStockPrice)
    this.stockSelectedUpdated = false;
    this.stockSelectedDeleted = false;
  }

  createStock(): void{

    this.stockCreateLoading = true;
    const stockData = this.createForm.value;

    const stock: Stock = {
      id: '',
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

  updateStockMainWindow(): void{
    const stock: Stock = {
      id: this.selectedStock.id,
      name: this.selectedStock.name,
      description: this.selectedStock.description,
      currentStockPrice: this.stockPriceControl.value,
      dailyStockPrice: this.selectedStock.dailyStockPrice,
      dailyTimestamp: this.selectedStock.dailyTimestamp
    }
    this.stockUpdateFromMain = true;
    this.stockService.updateStock(stock);
  }

  deleteStock(): void{
    this.stockDeleteLoading = true;
    this.stockService.deleteStock(this.selectedStock);
  }

  openModal(template: TemplateRef<any>) {
    this.stockSelectedName = this.selectedStock?.name;
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

  goBack(): void{
    this.location.back();
  }

}
