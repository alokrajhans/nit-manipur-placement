import {Entity, model, property} from '@loopback/repository';

@model({name: 'applied_jobs'})
export class AppliedJobs extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  company_name?: string;

  @property({
    type: 'string',
  })
  enrollment_number?: string;

  
  constructor(data?: Partial<AppliedJobs>) {
    super(data);
  }
}

export interface AppliedJobsRelations {
  // describe navigational properties here
}

export type AppliedJobsWithRelations = AppliedJobs & AppliedJobsRelations;
