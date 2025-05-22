import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../usuarios/entities/usuario.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);