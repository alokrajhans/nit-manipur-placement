import {
    repository,
    Count,
    CountSchema,
    Filter,
    Where,
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
  import {InterestedStudents} from '../models';
  import {InterestedStudentsRepository} from '../repositories';
  import {authenticate} from '@loopback/authentication';
  
  @authenticate('jwt')
  export class InterestedStudentsController {
    constructor(
      @repository(InterestedStudentsRepository)
      public interestedStudentsRepository: InterestedStudentsRepository,
    ) {}
  
    @post('/interested-students')
    @response(201, {
      description: 'InterestedStudents model instance',
      content: {'application/json': {schema: getModelSchemaRef(InterestedStudents)}},
    })
    async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(InterestedStudents, {
              title: 'NewInterestedStudents',
              exclude: ['id'], // id is auto-generated
            }),
          },
        },
      })
      interestedStudents: Omit<InterestedStudents, 'id'>,
    ): Promise<InterestedStudents> {
      return this.interestedStudentsRepository.create(interestedStudents);
    }
  
    @get('/interested-students/{enrollment_number}')
    @response(200, {
      description: 'InterestedStudents model instance',
      content: {'application/json': {schema: getModelSchemaRef(InterestedStudents)}},
    })
    async findByEnrollmentNumber(
      @param.path.number('enrollment_number') enrollment_number: number,
    ): Promise<InterestedStudents | null> {
      return this.interestedStudentsRepository.findOne({
        where: {enrollment_number},
      });
    }
  
    @get('/interested-students')
    @response(200, {
      description: 'Array of InterestedStudents model instances',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(InterestedStudents, {includeRelations: true}),
          },
        },
      },
    })
    async find(): Promise<InterestedStudents[]> {
      return this.interestedStudentsRepository.find();
    }
  
    @patch('/interested-students/{enrollment_number}')
    @response(204, {
      description: 'InterestedStudents PATCH success',
    })
    async updateByEnrollmentNumber(
      @param.path.number('enrollment_number') enrollment_number: number,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(InterestedStudents, {partial: true}),
          },
        },
      })
      interestedStudents: Partial<InterestedStudents>,
    ): Promise<void> {
      await this.interestedStudentsRepository.updateAll(interestedStudents, {
        enrollment_number,
      });
    }
  
    @put('/interested-students/{enrollment_number}')
    @response(204, {
      description: 'InterestedStudents PUT success',
    })
    async replaceByEnrollmentNumber(
      @param.path.number('enrollment_number') enrollment_number: number,
      @requestBody() interestedStudents: InterestedStudents,
    ): Promise<void> {
      // Find the existing record by enrollment_number
      const existing = await this.interestedStudentsRepository.findOne({
        where: {enrollment_number},
      });
      if (!existing) {
        throw new Error(`InterestedStudent with enrollment_number ${enrollment_number} not found`);
      }
      // Replace by primary key id
      await this.interestedStudentsRepository.replaceById(existing.id!, interestedStudents);
    }
  
    @del('/interested-students/{enrollment_number}')
    @response(204, {
      description: 'InterestedStudents DELETE success',
    })
    async deleteByEnrollmentNumber(
      @param.path.number('enrollment_number') enrollment_number: number,
    ): Promise<void> {
      const existing = await this.interestedStudentsRepository.findOne({
        where: {enrollment_number},
      });
      if (!existing) {
        throw new Error(`InterestedStudent with enrollment_number ${enrollment_number} not found`);
      }
      await this.interestedStudentsRepository.deleteById(existing.id!);
    }
  }
  