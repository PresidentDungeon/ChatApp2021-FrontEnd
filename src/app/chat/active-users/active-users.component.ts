import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '../shared/chat.service';
import {RegisterService} from '../../register/shared/register.service';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit, OnDestroy {

  connectedUsers: string[] = [];


  subscriptionUserLeave: Subscription;
  subscriptionUserJoin: Subscription;

  constructor(private chatService: ChatService, private registerService: RegisterService) { }

  ngOnInit(): void {

    this.registerService.getConnectedUsers().subscribe((connectedUsers) => {this.connectedUsers = connectedUsers;});

    this.subscriptionUserJoin = this.registerService.listenForRegister().subscribe((user) => {
      this.connectedUsers.push(user);
    })

    this.subscriptionUserLeave = this.registerService.listenForUnregister().subscribe((user) => {
      var index = this.connectedUsers.indexOf(user);
      if (index !== -1) {this.connectedUsers.splice(index, 1);}
    })

  }

  ngOnDestroy(): void {
    if(this.subscriptionUserJoin){this.subscriptionUserJoin.unsubscribe();}
    if(this.subscriptionUserLeave){this.subscriptionUserLeave.unsubscribe();}
  }

}