import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {ChatService} from '../chat/shared/chat.service';
import {RegisterService} from '../register/shared/register.service';

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate{

  constructor(private registerService: RegisterService, private router: Router) {
  }

  canActivate(): boolean{
    if(this.registerService.username !== null && this.registerService.username !== ''){
      if(!this.registerService.isRegistered){this.registerService.registerUser(this.registerService.username).subscribe();};
      return true;
    }

    else{
      this.router.navigate(['']);
      return false;
    }
  }
}
