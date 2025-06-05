import {Entity, model, property} from '@loopback/repository';

@model({name: 'selected_students'})
export class SelectedStudents extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true, // auto-increment/serial
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  enrollment_number: number;

  @property({
    type: 'string',
  })
  full_name?: string;

  @property({
    type: 'string',
  })
  Branch?: string;

  @property({
    type: 'number',
  })
  offers?: number;

  @property({type: 'string'}) company1?: string;
  @property({type: 'number'}) package1?: number;
  @property({type: 'string'}) type1?: string;
  @property({type: 'string'}) internship1?: string;

  @property({type: 'string'}) company2?: string;
  @property({type: 'number'}) package2?: number;
  @property({type: 'string'}) type2?: string;
  @property({type: 'string'}) internship2?: string;

  @property({type: 'string'}) company3?: string;
  @property({type: 'number'}) package3?: number;
  @property({type: 'string'}) type3?: string;
  @property({type: 'string'}) internship3?: string;

  constructor(data?: Partial<SelectedStudents>) {
    super(data);
  }
}
export interface SelectedStudentsRelations {
  // describe navigational properties here
}

export type SelectedStudentsWithRelations = SelectedStudents & SelectedStudentsRelations;
