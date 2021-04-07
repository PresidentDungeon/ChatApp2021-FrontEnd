import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {User} from '../../shared/user';
import {GetOnlineAmount, ListenForOnlineAmount, StopListeningForOnlineAmount, UpdateOnlineAmount} from './chat.actions';
import {Subscription} from 'rxjs';
import {RegisterService} from '../../register/shared/register.service';

export interface ChatStateModel{
  chatClients: User[];
  chatClient: User;
  onlineUsers: number;
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    chatClients: [],
    chatClient: undefined,
    onlineUsers: 0
  }
})

@Injectable()
export class ChatState {

  public isRegistered: Boolean = false;
  private clientsOnlineUnsub: Subscription | undefined;
  constructor(private registerService: RegisterService) {}

  @Selector()
  static onlineClients(state: ChatStateModel): number{
    return state.onlineUsers;
  }

  @Action(ListenForOnlineAmount)
  listenForOnlineAmount(ctx: StateContext<ChatStateModel>): void{
    this.clientsOnlineUnsub = this.registerService.listenForOnlineAmount()
      .subscribe(amount => {ctx.dispatch(new UpdateOnlineAmount(amount));});
  }

  @Action(StopListeningForOnlineAmount)
  stopListeningForOnlineAmount(ctx: StateContext<ChatStateModel>): void{
    if(this.clientsOnlineUnsub){this.clientsOnlineUnsub.unsubscribe();}
  }

  @Action(GetOnlineAmount)
  getOnlineAmount(ctx: StateContext<ChatStateModel>): void{
    this.registerService.getConnectedUsersAmount().subscribe((amount) => {ctx.dispatch(new UpdateOnlineAmount(amount));});
  }

  @Action(UpdateOnlineAmount)
  updateOnlineAmount(ctx: StateContext<ChatStateModel>, uoa: UpdateOnlineAmount): void {
    const state = ctx.getState();
    const newState: ChatStateModel = {...state, onlineUsers: uoa.onlineClients};
    ctx.setState(newState);
  }



  // @Selector()
  // static Clients(state: ChatStateModel): User[] {
  //   return state.chatClients;
  // }
  //
  // @Selector()
  // static ClientsOnline(state: ChatStateModel): number {
  //   return state.onlineUsers;
  // }
  //
  // @Action(GetClients)
  // GetClients(ctx: StateContext<ChatStateModel>) {
  //   const state = ctx.getState();
  //   const newState: ChatStateModel = {
  //     ...state,
  //     chatClients: [{id: '22', username: 'Anders', room: 'room1'}]
  //   };
  //   ctx.setState(newState);
  // }

  // @Action(GetClients)
  // GetOnlineClients(ctx: StateContext<ChatStateModel>) {
  //   const state = ctx.getState();
  //   const newState: ChatStateModel = {
  //     ...state,
  //     onlineUsers: 0
  //   };
  //   ctx.setState(newState);
  // }

}
