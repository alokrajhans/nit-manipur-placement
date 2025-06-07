import {DefaultCrudRepository} from '@loopback/repository';
import {InterestedStudents, InterestedStudentsRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InterestedStudentsRepository extends DefaultCrudRepository<
  InterestedStudents,
  typeof InterestedStudents.prototype.enrollment_number,
  InterestedStudentsRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(InterestedStudents, dataSource);
  }
}
