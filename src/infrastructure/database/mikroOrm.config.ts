import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { join } from 'path';
import 'dotenv/config';
import 'tsconfig-paths/register';

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL!,
  entities: ['./dist/**/*.model.js'],
  entitiesTs: ['./src/**/*.model.ts'],
  extensions: [Migrator],
  migrations: {
    path: join(__dirname, './migrations'),
    pathTs: join(__dirname, './migrations'),
    snapshot: true,
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
  },
};

export default config;
