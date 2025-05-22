import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { ClienteEstado } from './entities/cliente.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @Request() req) {
    return this.clientesService.create(createClienteDto, req.user);
  }

  @Get()
  findAll(@Request() req, @Query('estado') estado?: ClienteEstado) {
    if (estado) {
      return this.clientesService.filterByEstado(estado, req.user);
    }
    return this.clientesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientesService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
    @Request() req,
  ) {
    return this.clientesService.update(id, updateClienteDto, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientesService.remove(id, req.user);
  }

  @Get('vendedor/:vendedorId')
  @Roles(UserRole.ADMIN)
  findByVendedor(
    @Param('vendedorId') vendedorId: string,
    @Request() req,
  ) {
    return this.clientesService.findByVendedor(vendedorId, req.user);
  }

  @Get('filtro/:estado')
  filterByEstado(
    @Param('estado') estado: ClienteEstado,
    @Request() req,
  ) {
    return this.clientesService.filterByEstado(estado, req.user);
  }
}