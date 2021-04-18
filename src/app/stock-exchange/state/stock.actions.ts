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

export class UpdateCreateLoading{
  constructor(public loading: boolean) {}
  static readonly type = '[Stock] Update Create Loading'
}

export class UpdateError{
  constructor(public error: string) {}
  static readonly type = '[Stock] Update Error'
}

export class UpdateCreate{
  constructor(public error: string) {}
  static readonly type = '[Stock] Update Delete Error'
}





export class ListenForStockCreateResponse{
  constructor() {}
  static readonly type = '[Stock] Start Listening For Stock Create Response'
}

export class StopListeningForStockCreateResponse{
  constructor() {}
  static readonly type = '[Stock] Stop Listening For Stock Create Response'
}

export class CreateStock{
  constructor(public stock: Stock) {}
  static readonly type = '[Stock] Create Stock'
}
