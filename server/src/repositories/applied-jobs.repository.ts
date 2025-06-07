import {DefaultCrudRepository} from '@loopback/repository';
import {AppliedJobs, AppliedJobsRelations, InterestedStudents, InterestedStudentsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AppliedJobsRepository extends DefaultCrudRepository<
  AppliedJobs,
  typeof AppliedJobs.prototype.id,
  AppliedJobsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(AppliedJobs, dataSource);
  }
}
