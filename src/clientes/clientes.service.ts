import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { UserRole, Usuario } from '../usuarios/entities/usuario.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEstado } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto, user: Usuario) {
  const cliente = this.clientesRepository.create({
    ...createClienteDto,
    vendedor: user.role === UserRole.VENDEDOR ? user : undefined,
  });
  return this.clientesRepository.save(cliente);
}


  async findAll(user: Usuario) {
    if (user.role === 'admin') {
      return this.clientesRepository.find({ relations: ['vendedor'] });
    }
    return this.clientesRepository.find({
      where: { vendedor: { id: user.id } },
      relations: ['vendedor'],
    });
  }

  async findOne(id: string, user: Usuario) {
    const cliente = await this.clientesRepository.findOne({
      where: { id },
      relations: ['vendedor'],
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (
      user.role !== 'admin' &&
      cliente.vendedor?.id !== user.id
    ) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este cliente',
      );
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto, user: Usuario) {
    const cliente = await this.findOne(id, user);
    return this.clientesRepository.save({ ...cliente, ...updateClienteDto });
  }

  async remove(id: string, user: Usuario) {
    const cliente = await this.findOne(id, user);
    return this.clientesRepository.remove(cliente);
  }

  async findByVendedor(vendedorId: string, user: Usuario) {
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden ver clientes por vendedor',
      );
    }
    return this.clientesRepository.find({
      where: { vendedor: { id: vendedorId } },
      relations: ['vendedor'],
    });
  }

  async filterByEstado(estado: ClienteEstado, user: Usuario) {
    const where: any = { estado };
    if (user.role !== 'admin') {
      where.vendedor = { id: user.id };
    }
    return this.clientesRepository.find({
      where,
      relations: ['vendedor'],
    });
  }
}