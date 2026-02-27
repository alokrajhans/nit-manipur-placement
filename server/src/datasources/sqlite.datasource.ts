import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import path from 'path';

const config = {
  name: 'sqlite',
  connector: 'memory',
  file: path.join(__dirname, '../../data', 'nit-placement.db'),
  debug: process.env.NODE_ENV === 'development',
};

@lifeCycleObserver('datasource')
export class SqliteDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'sqlite';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sqlite', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
