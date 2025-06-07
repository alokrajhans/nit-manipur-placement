import {Entity, model, property} from '@loopback/repository';

@model({name: 'interested_students'})
export class InterestedStudents extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,   // indicates auto-generated primary key (auto-increment)
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  enrollment_number: number;

  @property({type: 'string'})
  full_name?: string;

  @property({type: 'string'})
  college_email?: string;

  @property({type: 'string'})
  gmail_id?: string;

  @property({type: 'string'})
  phone_number?: string;

  @property({type: 'string'})
  alternate_phone_number?: string;

  @property({type: 'number'})
  cgpa?: number;

  @property({type: 'number'})
  class_12th_percentage?: number;

  @property({type: 'number'})
  class_10th_percentage?: number;

  @property({type: 'string'})
  resume_drive_link?: string;

  @property({type: 'number'})
  Age?: number;

  @property({type: 'number'})
  gap_year?: number;

  @property({type: 'string'})
  Branch?: string;

  @property({type: 'string'})
  Backlog?: string;

  @property({type: 'string'})
  Gender?: string;

  @property({type: 'string'})
  Course?: string;

  @property({type: 'number'})
  Batch?: number;

  @property({type: 'date'})
  date_updated?: string;

  constructor(data?: Partial<InterestedStudents>) {
    super(data);
  }
}

export interface InterestedStudentsRelations {
  // describe navigational properties here
}

export type InterestedStudentsWithRelations = InterestedStudents & InterestedStudentsRelations;
