import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './Messaging/chat.component';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import { ActiveUsersComponent } from './active-users/active-users.component';


@NgModule({
  declarations: [ChatComponent, ActiveUsersComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    ProgressbarModule
  ]
})
export class ChatModule {}
