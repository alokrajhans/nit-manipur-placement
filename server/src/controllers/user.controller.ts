import {repository} from '@loopback/repository';
import {
  post,
  requestBody,
  get,
  param,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/register')
  async register(
    @requestBody() user: Omit<User, 'id' | 'token'>,
  ): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: {enrollment_number: user.enrollment_number},
    });
    if (exists) {
      throw new HttpErrors.BadRequest('Enrollment number already registered.');
    }

    return this.userRepository.create(user);
  }

  @post('/login')
  async login(
    @requestBody() credentials: {enrollment_number: string; password: string},
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {
        enrollment_number: credentials.enrollment_number,
        password: credentials.password,
      },
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const token = `token-${user.enrollment_number}-${Date.now()}`;
    await this.userRepository.updateById(user.id!, {...user, token});
    return {token};
  }

  @get('/me/{token}')
  async getProfile(@param.path.string('token') token: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {token}});
    if (!user) throw new HttpErrors.NotFound('Invalid or expired token');
    return user;
  }
}
