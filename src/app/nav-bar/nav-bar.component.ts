import {Component, OnDestroy, OnInit} from '@angular/core';
import {RegisterService} from '../register/shared/register.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChatService} from '../chat/shared/chat.service';
import {Select, Store} from '@ngxs/store';
import {ChatState} from '../chat/state/chat.state';
import {GetOnlineAmount, ListenForOnlineAmount, StopListeningForOnlineAmount} from '../chat/state/chat.actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  unsubscriber$ = new Subject();

  @Select(ChatState.onlineClientsAmount)
  clients$: Observable<number> | undefined;

  constructor(private registerService: RegisterService, private chatService: ChatService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForOnlineAmount());
    this.store.dispatch(new GetOnlineAmount());

    this.chatService.listenForMessages().pipe(takeUntil(this.unsubscriber$)).subscribe((message) => {
      if(!this.chatService.isOnActiveChat && this.registerService.isRegistered && !message.isSystemInfo){this.chatService.newMessages++;}
    })
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.store.dispatch(new StopListeningForOnlineAmount())
  }

  getMessages(): number{
    return this.chatService.newMessages;
  }

}
