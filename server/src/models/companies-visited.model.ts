import {Entity, model, property} from '@loopback/repository';

@model({name: 'companies_visited'})
export class CompaniesVisited extends Entity {
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
  type?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'number',
  })
  package?: number;

  @property({
    type: 'number',
  })
  offers?: number;

  @property({
    type: 'string',
  })
  internship?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  hr_email?: string;

  @property({
    type: 'string',
  })
  hr_contact?: string;

  constructor(data?: Partial<CompaniesVisited>) {
    super(data);
  }
}

export interface CompaniesVisitedRelations {
  // describe navigational properties here
}

export type CompaniesVisitedWithRelations = CompaniesVisited & CompaniesVisitedRelations;
