import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models';
import {MysqlDataSource} from '../datasources';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(
    @inject('datasources.MysqlDataSource') dataSource: MysqlDataSource,
  ) {
    super(User, dataSource);
  }
}
