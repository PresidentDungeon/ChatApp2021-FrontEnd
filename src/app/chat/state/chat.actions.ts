// export class GetClients{
//   static readonly type = '[Chat] Get Clients';
// }

export class ListenForOnlineAmount{
  static readonly type = '[Chat] Listen For Online Amount';
}

export class StopListeningForOnlineAmount{
  static readonly type = '[Chat] Stop Listening For Online Amount';
}

export class GetOnlineAmount{
  static readonly type = '[Chat] Get Online Amount'
}

export class UpdateOnlineAmount{
  constructor(public onlineClients: number) {}
  static readonly type = '[Chat] Update Online Amount'
}
