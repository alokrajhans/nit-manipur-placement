import {repository} from '@loopback/repository';
import {
  post,
  get,
  param,
  requestBody,
  response,
  HttpErrors,
  del,
} from '@loopback/rest';
import {AppliedJobs} from '../models';
import {AppliedJobsRepository} from '../repositories/applied-jobs.repository';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {SecurityBindings, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class AppliedJobsController {
  constructor(
    @repository(AppliedJobsRepository)
    public appliedJobsRepository: AppliedJobsRepository,
    @inject(SecurityBindings.USER) private currentUserProfile: UserProfile,
  ) {}

  /**
   * POST /applied-jobs
   * Logged-in user applies to a company
   */
  @post('/applied-jobs')
  @response(201, {
    description: 'AppliedJobs model instance',
    content: {
      'application/json': {
        schema: {type: 'object', properties: {message: {type: 'string'}}},
      },
    },
  })
  async applyToJob(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['company_name'],
            properties: {
              company_name: {type: 'string'},
            },
          },
        },
      },
    })
    data: {company_name: string},
  ): Promise<{message: string}> {
    const enrollment_number = this.currentUserProfile.name;
    if (!enrollment_number) {
      throw new HttpErrors.Unauthorized('User enrollment number missing in token');
    }

    // Check if user already applied to this company
    const existingApplication = await this.appliedJobsRepository.findOne({
      where: {
        enrollment_number,
        company_name: data.company_name,
      },
    });

    if (existingApplication) {
      throw new HttpErrors.BadRequest('User already applied for this company');
    }

    // Create new application record
    await this.appliedJobsRepository.create({
      enrollment_number,
      company_name: data.company_name,
    });

    return {message: 'Applied successfully'};
  }

  /**
   * GET /applied-jobs
   * Get all applied job entries
   */
  @get('/applied-jobs')
  @response(200, {
    description: 'Array of all AppliedJobs',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'number'},
              enrollment_number: {type: 'string'},
              company_name: {type: 'string'},
            },
          },
        },
      },
    },
  })
  async getAllAppliedJobs(): Promise<AppliedJobs[]> {
    return this.appliedJobsRepository.find({
      fields: {
        id: true,
        enrollment_number: true,
        company_name: true,
      },
    });
  }

  /**
   * GET /applied-jobs/company/{company_name}
   * Get all applications for a company
   */
  @get('/applied-jobs/company/{company_name}')
  @response(200, {
    description: 'Array of AppliedJobs for the given company',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              enrollment_number: {type: 'string'},
              company_name: {type: 'string'},
              id: {type: 'number'},
            },
          },
        },
      },
    },
  })
  async findByCompany(
    @param.path.string('company_name') company_name: string,
  ): Promise<AppliedJobs[]> {
    return this.appliedJobsRepository.find({
      where: {company_name},
      fields: {enrollment_number: true, company_name: true, id: true},
    });
  }

  /**
   * DELETE /applied-jobs/company/{company_name}
   * Delete all applications for a company (all users)
   */
  @del('/applied-jobs/company/{company_name}')
  @response(204, {
    description: 'Delete all applied jobs for a company',
  })
  async deleteByCompany(
    @param.path.string('company_name') company_name: string,
  ): Promise<void> {
    await this.appliedJobsRepository.deleteAll({company_name});
  }
}
