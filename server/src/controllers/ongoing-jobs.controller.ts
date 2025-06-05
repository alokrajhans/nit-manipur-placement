import {
    repository,
  } from '@loopback/repository';
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
  import {OngoingJobs} from '../models';
  import {OngoingJobsRepository} from '../repositories';
  
  export class OngoingJobsController {
    constructor(
      @repository(OngoingJobsRepository)
      public ongoingJobsRepository : OngoingJobsRepository,
    ) {}
  
    @post('/ongoing-jobs')
    @response(201, {
      description: 'OngoingJobs model instance',
      content: {'application/json': {schema: getModelSchemaRef(OngoingJobs)}},
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(OngoingJobs, {
              title: 'NewOngoingJobs',
              exclude: ['id'],
            }),
          },
        },
      })
      ongoingJobs: Omit<OngoingJobs, 'id'>,
    ): Promise<OngoingJobs> {
      return this.ongoingJobsRepository.create(ongoingJobs);
    }
  
    @get('/ongoing-jobs/{id}')
    @response(200, {
      description: 'OngoingJobs model instance',
      content: {'application/json': {schema: getModelSchemaRef(OngoingJobs)}},
    })
    async findById(@param.path.number('id') id: number): Promise<OngoingJobs> {
      return this.ongoingJobsRepository.findById(id);
    }
  
    @get('/ongoing-jobs')
    @response(200, {
      description: 'Array of OngoingJobs model instances',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(OngoingJobs, {includeRelations: true}),
          },
        },
      },
    })
    async find(): Promise<OngoingJobs[]> {
      return this.ongoingJobsRepository.find();
    }
  
    @patch('/ongoing-jobs/{id}')
    @response(204, {
      description: 'OngoingJobs PATCH success',
    })
    async updateById(
      @param.path.number('id') id: number,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(OngoingJobs, {partial: true}),
          },
        },
      })
      ongoingJobs: Partial<OngoingJobs>,
    ): Promise<void> {
      await this.ongoingJobsRepository.updateById(id, ongoingJobs);
    }
  
    @put('/ongoing-jobs/{id}')
    @response(204, {
      description: 'OngoingJobs PUT success',
    })
    async replaceById(
      @param.path.number('id') id: number,
      @requestBody() ongoingJobs: OngoingJobs,
    ): Promise<void> {
      await this.ongoingJobsRepository.replaceById(id, ongoingJobs);
    }
  
    @del('/ongoing-jobs/{id}')
    @response(204, {
      description: 'OngoingJobs DELETE success',
    })
    async deleteById(@param.path.number('id') id: number): Promise<void> {
      await this.ongoingJobsRepository.deleteById(id);
    }
  }
  