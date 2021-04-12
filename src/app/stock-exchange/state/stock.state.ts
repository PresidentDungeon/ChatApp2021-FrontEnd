import {Stock} from '../shared/stock';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {ChatStateModel} from '../../chat/state/chat.state';
import {Injectable} from '@angular/core';
import {GetOnlineAmount, ListenForOnlineAmount, StopListeningForOnlineAmount, UpdateOnlineAmount} from '../../chat/state/chat.actions';
import {
  GetStocks,
  UpdateCreate,
  UpdateCreateLoading,
  UpdateError,
  UpdateLoading,
  UpdateStocks
} from './stock.actions';
import {RegisterService} from '../../register/shared/register.service';
import {StockService} from '../shared/stock.service';
import {Filter} from '../../shared/filter';
import {Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


export interface StockStateModel{
  stocks: Stock[];
  error: string;
  createError: string;
  loading: boolean;
  createStockLoading: boolean;
  totalItems: number;
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stocks: [],
    error: '',
    createError: '',
    loading: true,
    createStockLoading: false,
    totalItems: 0
  }
})

@Injectable()
export class StockState {

  constructor(private stockService: StockService) {}

  @Selector()
  static stocks(state: StockStateModel): Stock[]{
    return state.stocks;
  }

  @Selector()
  static totalItems(state: StockStateModel): number{
    return state.totalItems;
  }

  @Selector()
  static loading(state: StockStateModel): boolean{
    return state.loading;
  }

  @Selector()
  static createLoading(state: StockStateModel): boolean{
    return state.createStockLoading;
  }

  @Selector()
  static error(state: StockStateModel): string{
    return state.error;
  }

  @Selector()
  static createError(state: StockStateModel): string{
    return state.createError;
  }

  @Action(GetStocks)
  getStocks(ctx: StateContext<StockStateModel>, gs: GetStocks): void{
    const filter: Filter = {currentPage: gs.currentPage, itemsPrPage: gs.itemsPrPage}
    this.stockService.getStock(filter).subscribe((stocks) => {ctx.dispatch(new UpdateStocks(stocks));}, error => {ctx.dispatch(new UpdateError(error.error))}, () => {ctx.dispatch(new UpdateLoading(false))});
  }

  @Action(UpdateStocks)
  updateStocks(ctx: StateContext<StockStateModel>, us: UpdateStocks): void {
    const state = ctx.getState();
    const newState: StockStateModel = {...state, stocks: us.stocksFilter.list, totalItems: us.stocksFilter.totalItems};
    ctx.setState(newState);
  }

  @Action(UpdateLoading)
  updateLoading(ctx: StateContext<StockStateModel>, ul: UpdateLoading): void {
    const state = ctx.getState();
    const newState: StockStateModel = {...state, loading: ul.loading};
    ctx.setState(newState);
  }

  @Action(UpdateCreateLoading)
  updateCreateLoading(ctx: StateContext<StockStateModel>, ucl: UpdateCreateLoading): void {
    const state = ctx.getState();
    const newState: StockStateModel = {...state, createStockLoading: ucl.loading};
    ctx.setState(newState);
  }

  @Action(UpdateError)
  updateError(ctx: StateContext<StockStateModel>, ue: UpdateError): void {
    const state = ctx.getState();
    const newState: StockStateModel = {...state, error: ue.error};
    ctx.setState(newState);
  }


  @Action(UpdateCreate)
  updateCreate(ctx: StateContext<StockStateModel>, uc: UpdateCreate): void {
    const state = ctx.getState();
    const newState: StockStateModel = {...state, createError: uc.error, createStockLoading: false};
    ctx.setState(newState);
  }


}
