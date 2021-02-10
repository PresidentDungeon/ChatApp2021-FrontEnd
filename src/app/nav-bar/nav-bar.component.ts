import {Component, OnDestroy, OnInit} from '@angular/core';
import {RegisterService} from '../register/shared/register.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  onlineUsers: number = 0;
  unsubscriber$ = new Subject();

  constructor(private registerService: RegisterService) { }

  ngOnInit(): void {
    this.registerService.getConnectedUsersAmount().subscribe((data) => {this.onlineUsers = data;});
    this.registerService.listenForOnlineAmount().pipe(takeUntil(this.unsubscriber$)).subscribe((data) => {this.onlineUsers = data;})
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
