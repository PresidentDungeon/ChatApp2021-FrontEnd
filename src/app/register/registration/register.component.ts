import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../shared/register.service';
import {User} from '../../shared/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)])
  });

  error: string = '';
  registerLoad: boolean = false;

  subscriptionRegister: Subscription;

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {

    this.registerService.isRegistered = false;

    this.registerForm.patchValue({
      name: (this.registerService.user !== null) ? this.registerService.user.username : ''
    });

    this.subscriptionRegister = this.registerService.getRegisterResponse().subscribe((data: any) => {
      if(data.created){this.registerService.user = this.registerService.user; this.registerService.isRegistered = true; this.router.navigate(['/chats']);}
      else{this.error = data.errorMessage}
      this.registerLoad = false;
    })
  }

  ngOnDestroy(): void {
    if(this.subscriptionRegister){this.subscriptionRegister.unsubscribe();}
  }

  createUser(): void{

    this.registerLoad = true;
    const registerData = this.registerForm.value;
    this.registerService.user = {username: registerData.name};

    this.registerService.registerUser(this.registerService.user);
  }



}
