import {Component, OnDestroy, OnInit} from '@angular/core';
import {RegisterService} from '../register/shared/register.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ChatService} from '../chat/shared/chat.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  onlineUsers: number = 0;
  unsubscriber$ = new Subject();

  constructor(private registerService: RegisterService, private chatService: ChatService) { }

  ngOnInit(): void {
    this.registerService.getConnectedUsersAmount().subscribe((data) => {this.onlineUsers = data;});
    this.registerService.listenForOnlineAmount().pipe(takeUntil(this.unsubscriber$)).subscribe((data) => {this.onlineUsers = data;})
    this.chatService.listenForMessages().pipe(takeUntil(this.unsubscriber$)).subscribe((message) => {
      if(!this.chatService.isOnActiveChat && this.registerService.isRegistered && !message.isSystemInfo){this.chatService.newMessages++;}
    })
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  getMessages(): number{
    return this.chatService.newMessages;
  }

}
