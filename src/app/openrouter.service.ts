import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class OpenRouterService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey = environment.apiKey;
  private conversationHistory: { role: string; content: string }[] = [];
  private modelName = 'Daizy'; // Custom display name

  constructor(private http: HttpClient) {
    console.log(environment.apiKey); // Should log your API key from Netlify
  }

  getChatResponse(prompt: string): Observable<{ text: string; codeBlocks: string[] }> {
    this.conversationHistory[0]={ 
      role: 'system', content: `You are Daisy, a coding assistant. Never call yourself by any other name.`,
      }
    this.conversationHistory.push({ 
      role: 'user', content: prompt });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: this.conversationHistory,
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        let content = response.choices[0].message.content;
        // Ensure the bot never calls itself by another name
        content = content.replace(/DeepSeek AI|DeepSeek V3|Mistral|OpenRouter AI/gi, this.modelName);


        this.conversationHistory.push({ role: 'assistant', content });
        const { text, codeBlocks } = this.extractCodeBlocks(content);
        return { text, codeBlocks };
        // return { model: this.modelName, text, codeBlocks }; // Return custom model name
      })
    );
  }

  private extractCodeBlocks(content: string): { text: string; codeBlocks: string[] } {
    const codeRegex = /```([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    let match;

    while ((match = codeRegex.exec(content)) !== null) {
      codeBlocks.push(match[1].trim());
    }

    const text = content.replace(codeRegex, '').trim();
    return { text, codeBlocks };
  }
}