import {DefaultCrudRepository} from '@loopback/repository';
import {SelectedStudents, SelectedStudentsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SelectedStudentsRepository extends DefaultCrudRepository<
  SelectedStudents,
  typeof SelectedStudents.prototype.enrollment_number,
  SelectedStudentsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(SelectedStudents, dataSource);
  }
}
