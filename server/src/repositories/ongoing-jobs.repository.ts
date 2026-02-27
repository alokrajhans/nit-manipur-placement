import {DefaultCrudRepository} from '@loopback/repository';
import {DataSource} from 'loopback-datasource-juggler';
import {OngoingJobs, OngoingJobsRelations} from '../models';
import {getDataSourceName} from '../datasources/datasource-helper';
import {inject} from '@loopback/core';

export class OngoingJobsRepository extends DefaultCrudRepository<
  OngoingJobs,
  typeof OngoingJobs.prototype.id,
  OngoingJobsRelations
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(OngoingJobs, dataSource);
  }
}

