import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ChatbotRequestDto, ChatbotResponseDto } from './dtos/chatbot.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@ApiTags('Chatbot')
@ApiBearerAuth()
@Controller('chatbot')
export class ChatbotController {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model;

  constructor(private readonly geminiService: GeminiService) {
    const apiKey = this.geminiService.getApiKey();
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  @Post('ask')
  @ApiOperation({
    summary: 'Consulta al chatbot especializado en cáncer',
    description: 'Este endpoint responde preguntas médicas sobre cáncer usando inteligencia artificial.',
  })
  @ApiBody({ type: ChatbotRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Respuesta generada por el chatbot',
    type: ChatbotResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token inválido o ausente)' })
  async askQuestion(@Body() body: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    const { pregunta } = body;
    const prompt = `Eres un asistente comercial y financiero especializado en proporcionar información sobre inversiones, bolsas, fondos, recuperación de capital, etc. Responde a la siguiente pregunta del usuario de forma informativa, concisa y en un lenguaje accesible: "${pregunta}"`;

    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.3,
          topP: 0.8,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      });

      const response = result.response;
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return { respuesta: response.candidates[0].content.parts[0].text };
      } else {
        return {
          respuesta:
            'Lo siento, no pude obtener una respuesta en este momento.',
        };
      }
    } catch (error) {
      console.error('Error al comunicarse con la API de Gemini:', error);
      return {
        respuesta:
          'Ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo más tarde.',
      };
    }
  }

}