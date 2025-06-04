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
  Req,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../usuarios/entities/usuario.entity';
import { ClienteEstado } from './entities/cliente.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/jwt-payload.interface';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createClienteDto: CreateClienteDto, @Request() req) {
    return this.clientesService.create(createClienteDto, req.user);
  }

  @Post("sheets")
  createMany(@Body() createClienteDto: CreateClienteDto[]) {
    return this.clientesService.createMany(createClienteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    console.log("Usuario autenticado:", req.user);
    return this.clientesService.findAll(req.user);
  }


  @Get("findEmail")
  findByEmail(@Query('email') email: string) {
    return this.clientesService.findByEmail(email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.clientesService.findOne(id, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
    @Request() req,
  ) {
    return this.clientesService.update(id, updateClienteDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientesService.remove(id, req.user);
  }

  @Get('vendedor/:vendedorId')
  findByVendedor(
    @Param('vendedorId') vendedorId: string
  ) {
    return this.clientesService.findByVendedor(vendedorId);
  }


  @Get('filtro/:estado')
  filterByEstado(
    @Param('estado') estado: ClienteEstado,
    @Request() req,
  ) {
    return this.clientesService.filterByEstado(estado, req.user);
  }

  @Post('asignar/vendedor/:vendedorId')
  asignarVendedor(
    @Param('vendedorId') vendedorId: string,
    @Body() clienteId: string,
    @Request() req,
  ) {
    return this.clientesService.asignarVendedor(clienteId, vendedorId, req.user);
  }

}