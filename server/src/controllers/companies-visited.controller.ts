import {repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {CompaniesVisited} from '../models';
import {CompaniesVisitedRepository} from '@repositories/companies-visited.repository';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class CompaniesVisitedController {
  constructor(
    @repository(CompaniesVisitedRepository)
    public companiesVisitedRepository: CompaniesVisitedRepository,
  ) {}

  @post('/companies-visited')
  @response(201, {
    description: 'CompaniesVisited model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(CompaniesVisited)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CompaniesVisited, {
            title: 'NewCompaniesVisited',
            exclude: ['id'],
          }),
        },
      },
    })
    companiesVisited: Omit<CompaniesVisited, 'id'>,
  ): Promise<CompaniesVisited> {
    return this.companiesVisitedRepository.create(companiesVisited);
  }

  @get('/companies-visited/{id}')
  @response(200, {
    description: 'CompaniesVisited model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(CompaniesVisited)},
    },
  })
  async findById(
    @param.path.number('id') id: number,
  ): Promise<CompaniesVisited> {
    return this.companiesVisitedRepository.findById(id);
  }

  @get('/companies-visited')
  @response(200, {
    description: 'Array of CompaniesVisited model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CompaniesVisited, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<CompaniesVisited[]> {
    return this.companiesVisitedRepository.find();
  }

  @patch('/companies-visited/{id}')
  @response(204, {
    description: 'CompaniesVisited PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CompaniesVisited, {partial: true}),
        },
      },
    })
    companiesVisited: Partial<CompaniesVisited>,
  ): Promise<void> {
    await this.companiesVisitedRepository.updateById(id, companiesVisited);
  }

  @put('/companies-visited/{id}')
  @response(204, {
    description: 'CompaniesVisited PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() companiesVisited: CompaniesVisited,
  ): Promise<void> {
    await this.companiesVisitedRepository.replaceById(id, companiesVisited);
  }

  @del('/companies-visited/{id}')
  @response(204, {
    description: 'CompaniesVisited DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.companiesVisitedRepository.deleteById(id);
  }
}
