import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { MetricasModule } from './metricas/metricas.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';
import { GeminiService } from './gemini/gemini.service';
import { ChatbotController } from './gemini/chatbot/ask.chatbot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'postgres'>('database.type'),
        url: configService.get<string>('database.url'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('database.synchronize'),
        ssl:{rejectUnauthorized: false},
      }),
    }),
    forwardRef(() => AuthModule),
    UsuariosModule,
    ClientesModule,
    VendedoresModule,
    MetricasModule,
  ],
  providers: [GeminiService],
  controllers: [ChatbotController],
})
export class AppModule {}
