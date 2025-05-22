import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricasController } from './metricas.controller';
import { MetricasService } from './metricas.service';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente, Usuario]),
    AuthModule,
  ],
  controllers: [MetricasController],
  providers: [MetricasService],
})
export class MetricasModule {}