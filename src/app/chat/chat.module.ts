import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './Messaging/chat.component';
import { ActiveUsersComponent } from './active-users/active-users.component';
import {SharedModule} from '../shared/shared.module';
import {NgxsModule} from '@ngxs/store';
import {ChatState} from './state/chat.state';


@NgModule({
  declarations: [ChatComponent, ActiveUsersComponent],
  exports: [],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ChatState])
  ]
})
export class ChatModule {}
