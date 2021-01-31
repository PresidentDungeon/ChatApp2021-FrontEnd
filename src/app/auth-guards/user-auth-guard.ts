import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {ChatService} from '../chat/shared/chat.service';

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate{

  constructor(private chatService: ChatService, private router: Router) {
  }

  canActivate(): boolean{
    if(this.chatService.username !== null && this.chatService.username !== ''){
      if(!this.chatService.isRegistered){this.chatService.registerUser(this.chatService.username); console.log("Registered from AuthGuard!!!")};
      return true;
    }
    else{
      this.router.navigate(['']);
      return false;
    }
  }
}
