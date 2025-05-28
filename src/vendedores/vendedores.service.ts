import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, Usuario } from '../usuarios/entities/usuario.entity';
import { ClientesService } from '../clientes/clientes.service';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    private clientesService: ClientesService,
  ) {}

  async findAll() {
    return this.usuariosRepository.find({
      where: { role: UserRole.VENDEDOR },
      select: ['id', 'name', 'email', 'avatar', 'telefono', 'bio'],
    });
  }

  async findOne(id: string, user: any) {
    if (user.role !== 'admin' && user.userId !== id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este vendedor',
      );
    }

    const vendedor = await this.usuariosRepository.findOne({
      where: { id, role: UserRole.VENDEDOR },
      select: ['id', 'name', 'email', 'avatar', 'telefono', 'bio'],
      relations: ['clientes'],
    });

    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    return vendedor;
  }

  async findTop(limit = 5) {
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('usuario.role = :role', { role: 'vendedor' })
      .leftJoinAndSelect('usuario.clientes', 'cliente')
      .select([
        'usuario.id',
        'usuario.name',
        'usuario.email',
        'usuario.avatar',
      ])
      .addSelect('COUNT(cliente.id)', 'totalClientes')
      .addSelect(
        'SUM(CASE WHEN cliente.estado = :aceptado THEN 1 ELSE 0 END)',
        'clientesAceptados',
      )
      .setParameter('aceptado', 'aceptado')
      .groupBy('usuario.id')
      .orderBy('clientesAceptados', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async assignClient(vendedorId: string, clienteId: string, user: any) {
    const vendedor = await this.usuariosRepository.findOneBy({
      id: vendedorId,
      role: UserRole.VENDEDOR,
    });
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    const cliente = await this.clientesService.findOne(clienteId, user);
    cliente.vendedor = vendedor;
    return this.clientesService.update(clienteId, cliente, user);
  }
}