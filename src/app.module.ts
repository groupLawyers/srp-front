import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { MetricasModule } from './metricas/metricas.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        // ...databaseConfig(),
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsuariosModule,
    ClientesModule,
    VendedoresModule,
    MetricasModule,
  ],
})
export class AppModule {}