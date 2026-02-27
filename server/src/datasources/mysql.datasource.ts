import {juggler} from '@loopback/repository';
import {inject} from '@loopback/core';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  name: 'mysql',
  connector: 'mysql',
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: +(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE ?? 'test',
};

// Export MySQL datasource WITHOUT @lifeCycleObserver decorator
// This prevents auto-connection attempts on app startup
// The datasource will only be instantiated when explicitly requested via application.ts
export class MysqlDataSource extends juggler.DataSource {
  static dataSourceName = 'mysql';

  constructor(
    @inject('datasources.config.mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
