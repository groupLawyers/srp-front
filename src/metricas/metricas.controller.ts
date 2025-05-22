import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MetricasService } from './metricas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('metricas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('metricas')
export class MetricasController {
  constructor(private readonly metricasService: MetricasService) {}

  @Roles(UserRole.ADMIN)
  @Get('resumen')
  getResumen() {
    return this.metricasService.obtenerResumen();
  }

  @Roles(UserRole.ADMIN)
  @Get('ventas/:periodo')
  getVentasPorPeriodo(@Param('periodo') periodo: string) {
    return this.metricasService.obtenerTopVendedores(periodo);
  }

  @Roles(UserRole.ADMIN)
  @Get('clientes-por-estado')
  getClientesPorEstado() {
    return this.metricasService.obtenerClientesPorEstado();
  }
}