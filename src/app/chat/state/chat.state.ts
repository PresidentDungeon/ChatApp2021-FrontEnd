import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {User} from '../../shared/user';
import {GetOnlineAmount, GetOnlineUsers, ListenForOnlineAmount,
  ListenForRegisterAndUnregister,
  StopListeningForOnlineAmount, StopListeningForRegisterAndUnregister, UpdateOnline,
  UpdateOnlineAmount, UpdateUserRegister, UpdateUserUnregister
} from './chat.actions';
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

  private clientsOnlineUnsub: Subscription | undefined;
  private userJoinUnsub: Subscription | undefined;
  private userLeaveUnsub: Subscription | undefined;

  constructor(private registerService: RegisterService) {}

  //Online Users

  @Selector()
  static onlineClientsAmount(state: ChatStateModel): number{
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

  //Users

  @Selector()
  static onlineClients(state: ChatStateModel): User[]{
    return state.chatClients;
  }

  @Action(ListenForRegisterAndUnregister)
  listenForRegisterAndUnregister(ctx: StateContext<ChatStateModel>): void{

    this.userJoinUnsub = this.registerService.listenForRegister()
      .subscribe(user => {ctx.dispatch(new UpdateUserRegister(user));})

    this.userLeaveUnsub = this.registerService.listenForUnregister()
      .subscribe(user => {ctx.dispatch(new UpdateUserUnregister(user));})
  }

  @Action(StopListeningForRegisterAndUnregister)
  stopListeningForRegisterAndUnregister(ctx: StateContext<ChatStateModel>): void{
    if(this.userJoinUnsub){this.userJoinUnsub.unsubscribe();}
    if(this.userLeaveUnsub){this.userLeaveUnsub.unsubscribe();}
  }

  @Action(UpdateUserRegister)
  updateUserRegister(ctx: StateContext<ChatStateModel>, uur: UpdateUserRegister): void{
    const state = ctx.getState();
    const users: User[] = [...state.chatClients];
    users.push(uur.user);
    const newState: ChatStateModel = {...state, chatClients: users};
    ctx.setState(newState);
  }

  @Action(UpdateUserUnregister)
  updateUserUnregister(ctx: StateContext<ChatStateModel>, uuu: UpdateUserUnregister): void{
    const state = ctx.getState();
    const users: User[] = [...state.chatClients];

    var index: number = -1;

    for(var i = 0; i < users.length; i++){
      if(users[i].username === uuu.user.username){index = i; break;}
    }

    if (index !== -1) {users.splice(index, 1);}

    const newState: ChatStateModel = {...state, chatClients: users};
    ctx.setState(newState);
  }

  @Action(GetOnlineUsers)
  getOnlineUsers(ctx: StateContext<ChatStateModel>, gou: GetOnlineUsers): void{
    this.registerService.getConnectedUsers(gou.room).subscribe((users) => {
      ctx.dispatch(new UpdateOnline(users));});
  }

  @Action(UpdateOnline)
  updateOnline(ctx: StateContext<ChatStateModel>, onlineAmount: UpdateOnline){
    const state = ctx.getState();
    const newState: ChatStateModel = {...state, chatClients: onlineAmount.clients};
    ctx.setState(newState);
  }

}
