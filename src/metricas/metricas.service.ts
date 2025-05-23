import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, ClienteEstado } from '../clientes/entities/cliente.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class MetricasService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async obtenerResumen() {
    const totalClientes = await this.clientesRepository.count();
    const clientesAceptados = await this.clientesRepository.count({
      where: { estado: ClienteEstado.ACEPTADO },
    });
    const clientesRechazados = await this.clientesRepository.count({
      where: { estado: ClienteEstado.RECHAZADO },
    });
    const clientesPagados = await this.clientesRepository.count({
      where: { pagado: true },
    });

    return {
      totalClientes,
      clientesAceptados,
      clientesRechazados,
      clientesPagados,
      tasaConversion: totalClientes > 0 ? (clientesAceptados / totalClientes) * 100 : 0,
    };
  }

  async obtenerClientesPorEstado() {
    const result = await this.clientesRepository
      .createQueryBuilder('cliente')
      .select('cliente.estado', 'estado')
      .addSelect('COUNT(cliente.id)', 'cantidad')
      .groupBy('cliente.estado')
      .getRawMany();

    return result.reduce((acc, curr) => {
      acc[curr.estado] = parseInt(curr.cantidad, 10);
      return acc;
    }, {});
  }

  async obtenerTopVendedores(limit = 5) { 
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoin('usuario.clientes', 'cliente')
      .select(['usuario.id', 'usuario.nombre', 'usuario.email'])
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
}