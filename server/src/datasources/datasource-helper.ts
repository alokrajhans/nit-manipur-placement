import {inject} from '@loopback/core';
import {DataSource} from '@loopback/repository';

/**
 * Get the appropriate datasource name based on DB_TYPE environment variable
 * This allows switching between SQLite and MySQL without changing repository code
 */
export function getDataSourceName(): string {
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  if (dbType === 'mysql') {
    return 'datasources.MysqlDataSource';
  }
  
  // Default to SQLite
  return 'datasources.SqliteDataSource';
}

/**
 * Helper to get datasource for repositories
 */
export const DataSourceBinding = {
  sqlite: 'datasources.SqliteDataSource',
  mysql: 'datasources.MysqlDataSource',
  default: () => getDataSourceName(),
};
