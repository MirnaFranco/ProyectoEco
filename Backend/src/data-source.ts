import { DataSource } from 'typeorm';
import { Usuario } from './entidades/Usuarios';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'ecoresiduos',
  database: 'ecoresiduos_db',
  synchronize: false,
  logging: false,
  entities: [Usuario],
});
