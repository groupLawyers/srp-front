import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ClienteEstado } from '../entities/cliente.entity';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  pais?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  fechaIngreso?: Date;

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

  @IsString()
@IsOptional()
vendedor?: string;

}