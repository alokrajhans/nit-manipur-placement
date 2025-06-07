import {model, property} from '@loopback/repository';

@model()
export class RegisterRequest {
  @property({type: 'string', required: true})
  enrollment_number: string;

  @property({type: 'string', required: true})
  password: string;

  // Add any extra fields if needed, e.g. name, email, etc.
}
