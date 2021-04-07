import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {ChatService} from '../shared/chat.service';
import {RegisterService} from '../../register/shared/register.service';
import {User} from '../../shared/user';
import {take, takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {ChatState} from '../state/chat.state';
import {
  GetOnlineAmount,
  GetOnlineUsers,
  ListenForOnlineAmount,
  ListenForRegisterAndUnregister,
  StopListeningForRegisterAndUnregister
} from '../state/chat.actions';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit, OnDestroy {

  @Select(ChatState.onlineClients)
  clients$: Observable<User[]> | undefined;

  constructor(private chatService: ChatService, private registerService: RegisterService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForRegisterAndUnregister());
    this.store.dispatch(new GetOnlineUsers(this.registerService.user.room));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new StopListeningForRegisterAndUnregister());
  }

}
