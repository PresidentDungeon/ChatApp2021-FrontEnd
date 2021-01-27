import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from './shared/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(0)]),
  });

  loading: boolean = true;
  error: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.loading = false;
  }

  sendMessage(): void{
    this.loading = true;
    const messageData = this.messageForm.value;

    let message: string = messageData.message;

    this.chatService.sendMessage(message);
  }

}
