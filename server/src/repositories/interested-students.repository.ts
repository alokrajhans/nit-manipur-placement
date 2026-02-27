import {DefaultCrudRepository} from '@loopback/repository';
import {DataSource} from 'loopback-datasource-juggler';
import {InterestedStudents, InterestedStudentsRelations} from '../models';
import {getDataSourceName} from '../datasources/datasource-helper';
import {inject} from '@loopback/core';

export class InterestedStudentsRepository extends DefaultCrudRepository<
  InterestedStudents,
  typeof InterestedStudents.prototype.enrollment_number,
  InterestedStudentsRelations
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(InterestedStudents, dataSource);
  }
}

