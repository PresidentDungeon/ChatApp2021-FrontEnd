import {Injectable, OnInit} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {RegisterService} from '../register/shared/register.service';

@Injectable({
  providedIn: 'root'
})

export class UserAuthGuard implements CanActivate{

  constructor(private registerService: RegisterService, private router: Router) {
  }

  canActivate(): boolean{
    if(this.registerService.user !== null && this.registerService.user.username !== ''){
      if(!this.registerService.isRegistered)
      {this.registerService.searchExistingUser(this.registerService.user).
      subscribe((exists) => {if(exists){return false;}else{this.registerService.registerUser(this.registerService.user); return true}},
        () => {return false;})}
      else{return true;}

    }

    else{
      this.router.navigate(['']);
      return false;
    }
  }

}
