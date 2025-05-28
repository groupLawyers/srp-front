import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatbotRequestDto {
  @ApiProperty({
    description: 'Pregunta del usuario relacionada con el cáncer',
    example: '¿Cuáles son los síntomas del cáncer de piel?',
  })
  @IsString()
  @IsNotEmpty()
  pregunta: string;
}

export class ChatbotResponseDto {
  @ApiProperty({
    description: 'Respuesta generada por la IA',
    example: 'Los síntomas comunes del cáncer de piel incluyen cambios en lunares...',
  })
  respuesta: string;
}
