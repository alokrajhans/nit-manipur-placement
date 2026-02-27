import {DefaultCrudRepository} from '@loopback/repository';
import {SelectedStudents, SelectedStudentsRelations} from '../models';
import {DataSource} from 'loopback-datasource-juggler';
import {inject} from '@loopback/core';
import {getDataSourceName} from '../datasources/datasource-helper';

export class SelectedStudentsRepository extends DefaultCrudRepository<
  SelectedStudents,
  typeof SelectedStudents.prototype.enrollment_number,
  SelectedStudentsRelations
> {
  constructor(
    @inject(getDataSourceName()) dataSource: DataSource,
  ) {
    super(SelectedStudents, dataSource);
  }
}
