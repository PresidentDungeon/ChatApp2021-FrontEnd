import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../shared/chat.service';
import {Subscription} from 'rxjs';
import {User} from '../shared/User';
import {debounceTime, tap} from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked{

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.ngOnDestroy();
  }

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(0)]),
  });

   loading: boolean = true;
   error: string = '';
   isTyping: boolean;
   shouldScroll: boolean;

   messages: String[] = [];
   typingUsers: User[] = [];

   subscriptionChat: Subscription;
   subscriptionTyping: Subscription;

  constructor(private chatService: ChatService, private elementRef : ElementRef) { }

  ngOnInit(): void {

    this.subscriptionChat = this.chatService.listenForMessages().subscribe((message) => {
      this.messages.push(message);
      this.shouldScroll = true;
    });

    this.subscriptionTyping = this.chatService.listenForTyping().subscribe((users) => {
      console.log(users);
      this.typingUsers = users;
    })

    this.messageForm.get('message').valueChanges.pipe(
        tap(value => this.checkTyping(true)),
        debounceTime(5000))
      .subscribe(value => {this.checkTyping(false);});


    this.loading = false;
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    debugger;
    if(this.subscriptionChat){this.subscriptionChat.unsubscribe();}
    if(this.subscriptionTyping){this.subscriptionTyping.unsubscribe();}
    this.chatService.unregisterUser(this.chatService.username);
    this.chatService.sendTypingStatus(this.chatService.username, false);
  }

  sendMessage(): void{
    const messageData = this.messageForm.value;
    let message: string = messageData.message;
    this.messageForm.get('message').reset();
    this.isTyping = false;
    this.chatService.sendTypingStatus(this.chatService.username, this.isTyping);

    this.chatService.sendMessage(message);
  }

  checkTyping(isTyping: boolean) {
    if (isTyping !== this.isTyping) {
      this.isTyping = isTyping;
      this.chatService.sendTypingStatus(this.chatService.username, this.isTyping);
    }
  }

   scrollToBottom(text: string) {

     let offsetScroll: number = 85;
     let domElement = this.elementRef.nativeElement.querySelector(`#textArea`);

     if( domElement.offsetHeight + offsetScroll >= (domElement.scrollHeight - domElement.scrollTop))
     {
       domElement.scrollTop = domElement.scrollHeight;
     }
  }

  ngAfterViewChecked(): void {
    if(this.shouldScroll){this.scrollToBottom("22"); this.shouldScroll = false;}
  }

}
