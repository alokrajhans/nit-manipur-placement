import {DefaultCrudRepository} from '@loopback/repository';
import {DataSource} from 'loopback-datasource-juggler';
import {getDataSourceName} from '../datasources/datasource-helper';
import {inject} from '@loopback/core';
import { CompaniesVisited, CompaniesVisitedRelations } from '../models';

export class CompaniesVisitedRepository extends DefaultCrudRepository<
  CompaniesVisited,
  typeof CompaniesVisited.prototype.id,
  CompaniesVisitedRelations
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(CompaniesVisited, dataSource);
  }
}
