import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CalculationHistory } from './entity/CalculationHistory';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './database/test.db',
  synchronize: false,
  logging: false,
  entities: [CalculationHistory],
  migrations: ['database/migration/**/*.ts'],
  subscribers: [],
});