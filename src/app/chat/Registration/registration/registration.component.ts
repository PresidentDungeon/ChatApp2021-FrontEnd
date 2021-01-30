import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../../shared/chat.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy{

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)])
  });

  error: string = '';
  registerLoad: boolean = false;
  username: string = ''

  subscriptionRegister: Subscription;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit(): void {

    this.subscriptionRegister = this.chatService.registerResponse().subscribe((success) => {
      if(success){this.chatService.username = this.username; this.router.navigate(['/chats']);}
      else{this.error = 'User with same username already registered in chat'}
      this.registerLoad = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptionRegister.unsubscribe();
  }

  createUser(): void{



    this.registerLoad = true;
    const registerData = this.registerForm.value;
    this.username = registerData.name;

    this.chatService.registerUser(this.username)
  }
}
