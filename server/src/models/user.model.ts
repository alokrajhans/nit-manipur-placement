import {Entity, model, property} from '@loopback/repository';

@model({name: 'user_table'})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  enrollment_number: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'number',
    required: false,
  })
  role: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
