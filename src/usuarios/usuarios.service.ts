import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto, currentUser: Usuario) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden crear usuarios',
      );
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
    const usuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });

    return this.usuariosRepository.save(usuario);
  }

  findAll() {
    
    return this.usuariosRepository.find({
      select: ['id', 'name', 'email', 'role', 'avatar', 'telefono', 'bio'],
    });
  }

  async findOne(id: string, currentUser: Usuario) {
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este usuario',
      );
    }

    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'avatar', 'telefono', 'bio'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
    currentUser: Usuario,
  ) {
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este usuario',
      );
    }

    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    return this.usuariosRepository.save({ ...usuario, ...updateUsuarioDto });
  }

  async remove(id: string, currentUser: Usuario) {
    if (currentUser.role !== 'admin') {
      throw new ForbiddenException(
        'Solo los administradores pueden eliminar usuarios',
      );
    }

    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.usuariosRepository.remove(usuario);
  }
}