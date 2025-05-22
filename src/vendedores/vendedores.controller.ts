import {
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('vendedores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendedores')
export class VendedoresController {
  constructor(private readonly vendedoresService: VendedoresService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.vendedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.vendedoresService.findOne(id, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Get('top')
  findTop() {
    return this.vendedoresService.findTop();
  }

  @Roles(UserRole.ADMIN)
  @Put(':id/asignar-cliente/:clienteId')
  assignClient(
    @Param('id') id: string,
    @Param('clienteId') clienteId: string,
    @Request() req,
  ) {
    return this.vendedoresService.assignClient(id, clienteId, req.user);
  }
}