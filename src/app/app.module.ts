import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';

import {AppRoutingModule } from './app-routing.module';
import {AppComponent } from './app.component';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {NavBarComponent } from './nav-bar/nav-bar.component';
import {HttpClientModule} from '@angular/common/http';

const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}}

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

