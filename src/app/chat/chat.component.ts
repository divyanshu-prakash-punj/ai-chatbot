import { Component } from '@angular/core';
import { OpenRouterService } from '../openrouter.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Message {
  sender: 'user' | 'bot';
  text?: string;
  codeBlocks?: string[];
  // model?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule 
  ],
  providers: [OpenRouterService, HttpClient],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  userInput: string = '';
  messages: Message[] = [];
  loading: boolean = false;
  // userInput: string = '';
  // responseText: string = '';
  // codeBlocks: string[] = [];
  // loading: boolean = false;

  constructor(private openRouterService: OpenRouterService) {}

  // sendMessage() {
  //   this.loading = true;
  //   this.openRouterService.getChatResponse(this.userInput).subscribe((data) => {
  //     this.responseText = data.text;
  //     this.codeBlocks = data.codeBlocks;
  //     this.loading = false;
  //   });
  // }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user's message to chat
    this.messages.push({ sender: 'user', text: this.userInput });

    this.loading = true;
    this.openRouterService.getChatResponse(this.userInput).subscribe((data) => {
      // Add bot response with text and code blocks
      this.messages.push({ sender: 'bot', text: data.text, codeBlocks: data.codeBlocks});
      this.loading = false;
    });

    this.userInput = ''; // Clear input field after sending
  }
}

