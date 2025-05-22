import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum ClienteEstado {
  PENDIENTE = 'pendiente',
  ACEPTADO = 'aceptado',
  RECHAZADO = 'rechazado',
  SEGUIMIENTO = 'seguimiento',
}

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  pais: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 100 })
  email: string;

  @Column({ type: 'date' })
  fechaIngreso: Date;

  @Column({ default: false })
  pagado: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.clientes)
  @JoinColumn({ name: 'vendedorId' })
  vendedor: Usuario;

  @Column({ nullable: true })
  vendedorId: string;

  @Column({
    type: 'enum',
    enum: ClienteEstado,
    default: ClienteEstado.PENDIENTE,
  })
  estado: ClienteEstado;

  @Column({ type: 'text', nullable: true })
  notas?: string;

  @Column({ type: 'date', nullable: true })
  ultimoContacto?: Date;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}