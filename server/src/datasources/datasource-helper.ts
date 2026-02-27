import {inject} from '@loopback/core';
import {DataSource} from '@loopback/repository';

/**
 * Get the appropriate datasource name based on USE_EXTERNAL_DB environment variable
 * This allows switching between SQLite (default) and MySQL (external) without changing repository code
 *
 * Default: SQLite (no external database needed)
 * Set USE_EXTERNAL_DB=true to use external MySQL database
 */
export function getDataSourceName(): string {
  const useExternalDb = process.env.USE_EXTERNAL_DB === 'true';
  
  if (useExternalDb) {
    return 'datasources.MysqlDataSource';
  }
  
  // Default to SQLite (lightweight, no external dependency)
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
