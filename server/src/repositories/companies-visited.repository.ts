import {DefaultCrudRepository} from '@loopback/repository';

import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { CompaniesVisited, CompaniesVisitedRelations } from '../models';

export class CompaniesVisitedRepository extends DefaultCrudRepository<
  CompaniesVisited,
  typeof CompaniesVisited.prototype.id,
  CompaniesVisitedRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(CompaniesVisited, dataSource);
  }
}
