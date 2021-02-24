import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {Socket} from 'ngx-socket-io';

@Injectable({providedIn: 'root'})
export class SocketChatApp extends Socket {
  constructor() {
    super({ url: 'http://localhost:3000', options: {} });
  }
}

@Injectable({providedIn: 'root'})
export class SocketStockExchange extends Socket {
  constructor() {
    super({ url: 'http://localhost:3300', options: {} });
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule
  ],
  exports: [CommonModule,FontAwesomeModule, ReactiveFormsModule, ProgressbarModule],
  providers: [SocketChatApp, SocketStockExchange]
})
export class SharedModule { }
