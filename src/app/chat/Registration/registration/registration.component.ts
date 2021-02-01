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
export class RegistrationComponent implements OnInit{

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)])
  });

  error: string = '';
  registerLoad: boolean = false;
  username: string = ''

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit(): void {

    this.chatService.isRegistered = false;

    this.registerForm.patchValue({
      name:this.chatService.username
    });
  }

  createUser(): void{

    this.registerLoad = true;
    const registerData = this.registerForm.value;
    this.username = registerData.name;

    this.chatService.registerUser(this.username).subscribe((data) => {

      if(data.created){this.chatService.username = this.username; this.chatService.isRegistered = true; this.router.navigate(['/chats']);}
      else{this.error = data.errorMessage}
      this.registerLoad = false;
    })
  }
}
