import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedoresController } from './vendedores.controller';
import { VendedoresService } from './vendedores.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ClientesModule,
    AuthModule,
  ],
  controllers: [VendedoresController],
  providers: [VendedoresService],
})
export class VendedoresModule {}