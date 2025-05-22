import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ClienteEstado } from '../entities/cliente.entity';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsNotEmpty()
  fechaIngreso: Date;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsEnum(ClienteEstado)
  @IsOptional()
  estado?: ClienteEstado;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsDateString()
  @IsOptional()
  ultimoContacto?: Date;
}