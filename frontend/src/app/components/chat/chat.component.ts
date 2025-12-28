import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  requestId!: number;
  currentUserId!: number;
  private pollSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.authService.currentUserValue?.id || 0;

    if (!this.requestId) {
      this.router.navigate(['/requests']);
      return;
    }

    // Start polling for messages every 3 seconds
    this.pollSubscription = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.chatService.getMessages(this.requestId))
      )
      .subscribe({
        next: (data) => {
          if (data.messages.length !== this.messages.length) {
            this.messages = data.messages;
            setTimeout(() => this.scrollToBottom(), 100);
          }
        },
        error: (err) => console.error('Polling error:', err)
      });
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.requestId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        // Immediate refresh would be nice, but polling will catch it soon.
        // Let's force a refresh for better UX
        this.chatService.getMessages(this.requestId).subscribe(data => {
          this.messages = data.messages;
          setTimeout(() => this.scrollToBottom(), 100);
        });
      }
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onBack(): void {
    this.router.navigate(['/requests', this.requestId]);
  }
}
