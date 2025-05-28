import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.APIG!;
    if (!this.apiKey) {
      console.error('Error: La variable de entorno GEMINI_API_KEY no está definida.');
     
    } else {
      console.log('Gemini API Key cargada (parcial):', this.apiKey.substring(0, 8) + '...');
    }
  }

  getApiKey(): string {
    return this.apiKey;
  }

  
}