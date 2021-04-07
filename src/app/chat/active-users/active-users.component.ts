import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {ChatService} from '../shared/chat.service';
import {RegisterService} from '../../register/shared/register.service';
import {User} from '../../shared/user';
import {take, takeUntil} from 'rxjs/operators';
import {Select} from '@ngxs/store';
import {ChatState} from '../state/chat.state';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit, OnDestroy {

  connectedUsers: User[] = [];
  unsubscriber$ = new Subject();

  constructor(private chatService: ChatService, private registerService: RegisterService) { }

  ngOnInit(): void {

    this.registerService.getConnectedUsers(this.registerService.user.room).subscribe((connectedUsers) => {this.connectedUsers = connectedUsers;});

    this.registerService.listenForRegister().pipe(takeUntil(this.unsubscriber$)).subscribe((user) => {
      this.connectedUsers.push(user);
    })

    this.registerService.listenForUnregister().pipe(takeUntil(this.unsubscriber$)).subscribe((user) => {

      var index: number = -1;

      for(var i = 0; i < this.connectedUsers.length; i++){
        if(this.connectedUsers[i].username === user.username){index = i; break;}
      }

      if (index !== -1) {this.connectedUsers.splice(index, 1);}
    })

  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
