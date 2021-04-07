// export class GetClients{
//   static readonly type = '[Chat] Get Clients';
// }

//Current online users

import {User} from '../../shared/user';

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

//Online users in room

export class ListenForRegisterAndUnregister{
  static readonly type = '[Chat] Listen For Register And Unregister'
}

export class StopListeningForRegisterAndUnregister{
  static readonly type = '[Chat] Stop Listening For Register And Unregister'
}

export class GetOnlineUsers{
  constructor(public room: string) {}
  static readonly type = '[Chat] Get Online Users'
}

export class UpdateUserRegister{
  constructor(public user: User) {}
  static readonly type = '[Chat] Update User Register'
}

export class UpdateUserUnregister{
  constructor(public user: User) {}
  static readonly type = '[Chat] Update User Unregister'
}

export class UpdateOnline{
  constructor(public clients: User[]) {}
  static readonly type = '[Chat] Update Online'
}
