import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VENDEDOR })
  role: UserRole;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, length: 20 })
  telefono?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.vendedor)
  clientes: Cliente[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}