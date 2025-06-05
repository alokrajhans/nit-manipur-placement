import {DefaultCrudRepository} from '@loopback/repository';
import {OngoingJobs, OngoingJobsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OngoingJobsRepository extends DefaultCrudRepository<
  OngoingJobs,
  typeof OngoingJobs.prototype.id,
  OngoingJobsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(OngoingJobs, dataSource);
  }
}
