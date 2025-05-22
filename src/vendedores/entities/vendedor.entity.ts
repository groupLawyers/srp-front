import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Entity } from 'typeorm';

@Entity()
export class Vendedor extends Usuario {
  // Las relaciones ya están definidas en la entidad Usuario
  // clientes: Cliente[];

  // Propiedades calculadas
  get ventasRealizadas(): number {
    return this.clientes?.filter((c) => c.pagado)?.length || 0;
  }

  get rendimiento(): 'alto' | 'medio' | 'bajo' {
    const tasaConversion =
      this.clientes?.length > 0
        ? this.ventasRealizadas / this.clientes.length
        : 0;

    if (tasaConversion > 0.7) return 'alto';
    if (tasaConversion > 0.3) return 'medio';
    return 'bajo';
  }
}