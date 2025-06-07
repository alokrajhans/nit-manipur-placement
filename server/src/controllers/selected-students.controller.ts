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
import {SelectedStudents} from '../models';
import {SelectedStudentsRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class SelectedStudentsController {
  constructor(
    @repository(SelectedStudentsRepository)
    public selectedStudentsRepository: SelectedStudentsRepository,
  ) {}

  @post('/selected-students')
  @response(201, {
    description: 'SelectedStudents model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(SelectedStudents)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SelectedStudents, {
            title: 'NewSelectedStudents',
            exclude: ['id'], // exclude auto-generated id
          }),
        },
      },
    })
    selectedStudents: Omit<SelectedStudents, 'id'>,
  ): Promise<SelectedStudents> {
    return this.selectedStudentsRepository.create(selectedStudents);
  }

  @get('/selected-students/{enrollment_number}')
  @response(200, {
    description: 'SelectedStudents model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(SelectedStudents)},
    },
  })
  async findByEnrollmentNumber(
    @param.path.number('enrollment_number') enrollment_number: number,
  ): Promise<SelectedStudents | null> {
    return this.selectedStudentsRepository.findOne({
      where: {enrollment_number},
    });
  }

  @get('/selected-students')
  @response(200, {
    description: 'Array of SelectedStudents model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SelectedStudents, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<SelectedStudents[]> {
    return this.selectedStudentsRepository.find();
  }

  @patch('/selected-students/{enrollment_number}')
  @response(204, {
    description: 'SelectedStudents PATCH success',
  })
  async updateByEnrollmentNumber(
    @param.path.number('enrollment_number') enrollment_number: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SelectedStudents, {partial: true}),
        },
      },
    })
    selectedStudents: Partial<SelectedStudents>,
  ): Promise<void> {
    await this.selectedStudentsRepository.updateAll(selectedStudents, {
      enrollment_number,
    });
  }

  @put('/selected-students/{enrollment_number}')
  @response(204, {
    description: 'SelectedStudents PUT success',
  })
  async replaceByEnrollmentNumber(
    @param.path.number('enrollment_number') enrollment_number: number,
    @requestBody() selectedStudents: SelectedStudents,
  ): Promise<void> {
    const existing = await this.selectedStudentsRepository.findOne({
      where: {enrollment_number},
    });
    if (!existing) {
      throw new Error(
        `SelectedStudent with enrollment_number ${enrollment_number} not found`,
      );
    }
    await this.selectedStudentsRepository.replaceById(
      existing.id!,
      selectedStudents,
    );
  }

  @del('/selected-students/{enrollment_number}')
  @response(204, {
    description: 'SelectedStudents DELETE success',
  })
  async deleteByEnrollmentNumber(
    @param.path.number('enrollment_number') enrollment_number: number,
  ): Promise<void> {
    const existing = await this.selectedStudentsRepository.findOne({
      where: {enrollment_number},
    });
    if (!existing) {
      throw new Error(
        `SelectedStudent with enrollment_number ${enrollment_number} not found`,
      );
    }
    await this.selectedStudentsRepository.deleteById(existing.id!);
  }
}
