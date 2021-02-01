import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserAuthGuard} from './auth-guards/user-auth-guard';

const routes: Routes = [
  {path: '', redirectTo: 'register', pathMatch: 'full'},
  {path: 'chats', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule), canActivate: [UserAuthGuard]},
  {path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
