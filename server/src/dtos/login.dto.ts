import {model, property} from '@loopback/repository';

@model()
export class LoginRequest {
  @property({type: 'string', required: true})
  enrollment_number: string;

  @property({type: 'string', required: true})
  password: string;
}
