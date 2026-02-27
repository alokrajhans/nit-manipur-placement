import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DataSource} from 'loopback-datasource-juggler';
import {User} from '../models';
import {getDataSourceName} from '../datasources/datasource-helper';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(User, dataSource);
  }
}
