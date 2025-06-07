import {Entity, model, property} from '@loopback/repository';

@model({name: 'ongoing_jobs'})
export class OngoingJobs extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({type: 'string'})
  company_name?: string;

  @property({type: 'string'})
  job_title?: string;

  @property({type: 'string'})
  backlog?: string;

  @property({type: 'string'})
  type?: string;

  @property({type: 'string'})
  opportunity?: string;

  @property({type: 'string'})
  Branch?: string;

  @property({type: 'number'})
  package?: number;

  @property({type: 'string'})
  remarks?: string;
  @property({type: 'string'})
  jobDescriptionLink?: string;
  @property({type: 'string'})
  Course?: string;
  @property({type: 'string'})
  handleBy?: string;

  @property({type: 'number'})
  min_cgpa?: number;

  @property({type: 'date'})
  deadline?: string;

  @property({type: 'number'})
  class_12th_percentage?: number;

  @property({type: 'number'})
  class_10th_percentage?: number;

  @property({type: 'string'})
  bond?: string;

  @property({type: 'number'})
  stipend?: number;

  @property({type: 'date'})
  date_updated?: string;

  constructor(data?: Partial<OngoingJobs>) {
    super(data);
  }
}

export interface OngoingJobsRelations {
  // describe navigational properties here
}

export type OngoingJobsWithRelations = OngoingJobs & OngoingJobsRelations;
