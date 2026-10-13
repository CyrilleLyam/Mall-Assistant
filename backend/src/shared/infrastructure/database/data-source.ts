import { existsSync } from 'node:fs';
import { DataSource } from 'typeorm';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ['src/**/*.orm-entity.ts'],
  migrations: ['src/shared/infrastructure/database/migrations/*.ts'],
});
