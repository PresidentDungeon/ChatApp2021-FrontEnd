import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '../shared/chat.service';
import {Subscription} from 'rxjs';
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
    message: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
  });

   loading: boolean = true;
   error: string = '';
   isTyping: boolean;
   shouldScroll: boolean;

   messages: string[] = [];
   typingUsers: string[] = [];
   connectedUsers: string[] = [];

   subscriptionChat: Subscription;
   subscriptionTyping: Subscription;

   subscriptionUserRequest: Subscription;
   subscriptionUserLeave: Subscription;
   subscriptionUserJoin: Subscription;

  constructor(private chatService: ChatService, private elementRef : ElementRef) { }

  ngOnInit(): void {

    this.subscriptionChat = this.chatService.listenForMessages().subscribe((message) => {
      this.messages.push(message);
      this.shouldScroll = true;
    });

    this.subscriptionTyping = this.chatService.listenForTyping().subscribe((users) => {
      this.typingUsers = users;
    })

    this.messageForm.get('message').valueChanges.pipe(
        tap(value => this.checkTyping(true)),
        debounceTime(5000))
      .subscribe(value => {this.checkTyping(false);});

    this.subscriptionUserJoin = this.chatService.listenForRegister().subscribe((user) => {
      this.connectedUsers.push(user);
    })

    this.subscriptionUserLeave = this.chatService.listenForUnregister().subscribe((user) => {
      var index = this.connectedUsers.indexOf(user);
      if (index !== -1) {this.connectedUsers.splice(index, 1);}
    })

    this.subscriptionUserRequest = this.chatService.handleUserResponse().subscribe((users) => {
      this.connectedUsers = users; this.loading = false;
    });

    this.chatService.handleUserRequest();
  }

  ngOnDestroy(): void {
    if(this.subscriptionChat){this.subscriptionChat.unsubscribe();}
    if(this.subscriptionTyping){this.subscriptionTyping.unsubscribe();}
    if(this.subscriptionUserRequest){this.subscriptionUserRequest.unsubscribe();}
    if(this.subscriptionUserJoin){this.subscriptionUserJoin.unsubscribe();}
    if(this.subscriptionUserLeave){this.subscriptionUserLeave.unsubscribe();}

    this.chatService.unregisterUser(this.chatService.username);
    this.chatService.sendTypingStatus(this.chatService.username, false);
  }

  ngAfterViewChecked(): void {
    if(this.shouldScroll){this.scrollToBottom("22"); this.shouldScroll = false;}
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

  getTypers(): string{
    return null;
  }

  scrollToBottom(text: string) {

     let offsetScroll: number = 85;
     let domElement = this.elementRef.nativeElement.querySelector(`#textArea`);

     if( domElement.offsetHeight + offsetScroll >= (domElement.scrollHeight - domElement.scrollTop))
     {
       domElement.scrollTop = domElement.scrollHeight;
     }
  }

  calculateTypingText(): string{

    let size: number = this.typingUsers.length;
    let maxSize: number = 4;
    let numberCount: number = 0;
    let text: string = '';

    if(size === 0){return '';}
    if(size > maxSize){return 'Several people are typing...'}

    for (numberCount; numberCount <= size; numberCount++) {

      text += this.typingUsers[numberCount].bold();

      if(numberCount === size - 1 || numberCount === maxSize - 1){text += (size === 1) ? " is typing..." : " are typing..."; return text;}
      if(numberCount === size - 2 || numberCount === maxSize - 2){text += " & ";}
      else{text += ", ";}

    }
  }

}
