import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RegisterService} from '../shared/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(16)])
  });

  error: string = '';
  registerLoad: boolean = false;
  username: string = ''

  constructor(private registerService: RegisterService, private router: Router) { }

  ngOnInit(): void {

    this.registerService.isRegistered = false;

    this.registerForm.patchValue({
      name:this.registerService.username
    });
  }

  createUser(): void{

    this.registerLoad = true;
    const registerData = this.registerForm.value;
    this.username = registerData.name;

    this.registerService.registerUser(this.username).subscribe((data) => {

      if(data.created){this.registerService.username = this.username; this.registerService.isRegistered = true; this.router.navigate(['/chats']);}
      else{this.error = data.errorMessage}
      this.registerLoad = false;
    })
  }

}
