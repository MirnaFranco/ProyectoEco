import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

/**
 * Define la entidad Usuario, mapeando a la tabla 'usuarios' con campos descriptivos.
 * - La contraseña se marca con 'select: false' para no ser cargada por defecto.
 * - Se utiliza @Unique(['email']) para asegurar que el correo electrónico sea único.
 */
@Entity('usuarios')
@Unique(['email'])
export class Usuario {
    
  @PrimaryGeneratedColumn('increment', { name: 'id_usuario' })
  id!: number; 

  @Column({ type: 'varchar', length: 255 })
  nombre!: string;

  @Column({ type: 'varchar', length: 255 }) 
  email!: string;

  // Usamos 'select: false' por seguridad: evita que se devuelva en consultas automáticas
  @Column({ name: 'contraseña', type: 'text', select: false }) 
  password!: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}