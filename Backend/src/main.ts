// src/index.ts
import express from 'express';
import { AppDataSource } from './data-source.js';
import usuarioRoutes from './routes/usuarios.routes.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use('/usuarios', usuarioRoutes);
  app.listen(3000, () => console.log('Servidor iniciado en puerto 3000'));
});