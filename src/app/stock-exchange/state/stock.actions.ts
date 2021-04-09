import {Stock} from '../shared/stock';
import {FilterList} from '../../shared/filterList';

export class GetStocks{
  constructor(public currentPage: number, public itemsPrPage: number) {}
  static readonly type = '[Stock] Get Stocks'
}

export class UpdateStocks{
  constructor(public stocksFilter: FilterList<Stock>) {}
  static readonly type = '[Stock] Update Stocks'
}

export class UpdateLoading{
  constructor(public loading: boolean) {}
  static readonly type = '[Stock] Update Loading'
}

export class UpdateError{
  constructor(public error: string) {}
  static readonly type = '[Stock] Update Error'
}
