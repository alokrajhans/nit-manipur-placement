import {DefaultCrudRepository} from '@loopback/repository';
import {DataSource} from 'loopback-datasource-juggler';
import {AppliedJobs, AppliedJobsRelations, InterestedStudents, InterestedStudentsRelations} from '../models';
import {getDataSourceName} from '../datasources/datasource-helper';
import {inject} from '@loopback/core';

export class AppliedJobsRepository extends DefaultCrudRepository<
  AppliedJobs,
  typeof AppliedJobs.prototype.id,
  AppliedJobsRelations
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(AppliedJobs, dataSource);
  }
}
