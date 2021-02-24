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
import {Subject, Subscription} from 'rxjs';
import {debounceTime, takeUntil, tap} from 'rxjs/operators';
import {Message} from '../shared/message';
import {RegisterService} from '../../register/shared/register.service';
import {User} from '../../shared/user';
import {faChevronCircleLeft, faPaperPlane} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked{

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.ngOnDestroy();
  }

  circleLeft = faChevronCircleLeft; faPaperPlane = faPaperPlane

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(300)]),
  });

   loading: boolean = true;
   error: string = '';
   isTyping: boolean;
   shouldScroll: boolean;
   joinedUser: User;

   messages: Message[] = [];
   typingUsers: User[] = [];

   unsubscriber$ = new Subject();

  constructor(private chatService: ChatService, private registerService: RegisterService, private elementRef : ElementRef) { }

  ngOnInit(): void {

    this.chatService.listenForMessages().pipe(takeUntil(this.unsubscriber$)).
    subscribe((message) => {
      this.messages.push(message);
      this.shouldScroll = true;
    });

    this.chatService.listenForTyping().pipe(takeUntil(this.unsubscriber$)).
    subscribe((users) => {
      this.typingUsers = users;
    })

    this.messageForm.get('message').valueChanges.pipe(
        tap(value => this.checkTyping(true)),
        debounceTime(5000))
      .subscribe(value => {this.checkTyping(false);});

    this.chatService.getAllMessages(this.registerService.user).subscribe((messages) => {this.messages = messages;},
      () => {this.loading = false;},
      () => {this.loading = false; })

    this.chatService.isOnActiveChat = true;
    this.chatService.newMessages = 0;
    this.joinedUser = this.registerService.user;
  }

  ngOnDestroy(): void {

    this.unsubscriber$.next();
    this.unsubscriber$.complete();

    this.chatService.sendTypingStatus(this.registerService.user, false);
    this.chatService.isOnActiveChat = false;
  }

  ngAfterViewChecked(): void {
    if(this.shouldScroll){this.scrollToBottom(); this.shouldScroll = false;}
  }

  sendMessage(): void{
    const messageData = this.messageForm.value;
    let messageString: string = messageData.message;

    let date = new Date();
    date.setTime(date.getTime() + 2*60*60*1000);

    const message: Message = {
      message: messageString,
      user: this.registerService.user,
      timestamp: new Date(date),
      isSystemInfo: false
    }

    this.messageForm.get('message').reset();
    this.isTyping = false;
    this.chatService.sendTypingStatus(this.registerService.user, this.isTyping);

    this.chatService.sendMessage(message);
  }

  checkTyping(isTyping: boolean) {
    if (isTyping !== this.isTyping) {
      this.isTyping = isTyping;
      this.chatService.sendTypingStatus(this.registerService.user, this.isTyping);
    }
  }

  scrollToBottom() {
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

      text += this.typingUsers[numberCount].username.bold();

      if(numberCount === size - 1 || numberCount === maxSize - 1){text += (size === 1) ? " is typing..." : " are typing..."; return text;}
      if(numberCount === size - 2 || numberCount === maxSize - 2){text += " & ";}
      else{text += ", ";}
    }
  }
}
