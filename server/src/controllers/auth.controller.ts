import {
  post,
  requestBody,
  HttpErrors,
  get,
  RestBindings,
  param,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {compare, hash} from 'bcryptjs';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {authenticate} from '@loopback/authentication';

import {UserRepository} from '../repositories';
import {User} from '../models';
import {JWTService} from '../service/jwt-service';

export class AuthController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @inject('services.jwt.service') public jwtService: JWTService,
  ) {}

  /**
   * ✅ Registration Endpoint
   */
  @post('/register')
  async register(
    @requestBody()
    newUserRequest: {
      enrollment_number: string;
      password: string;
    },
  ): Promise<{message: string; userId?: number}> {
    const {enrollment_number, password} = newUserRequest;

    if (!enrollment_number) {
      throw new HttpErrors.BadRequest('Enrollment number is required');
    }

    if (!password || password.length < 6) {
      throw new HttpErrors.BadRequest('Password must be at least 6 characters');
    }

    // Check for existing user
    const existingUser = await this.userRepo.findOne({
      where: {enrollment_number},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest(
        'User with this enrollment number already exists',
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    const savedUser = await this.userRepo.create({
      enrollment_number,
      password: hashedPassword,
      role: 2,
    });

    return {
      message: 'User registered successfully',
      userId: savedUser.id,
    };
  }

  /**
   * ✅ Login Endpoint
   */
  @post('/login')
  async login(
    @requestBody() credentials: {enrollment_number: string; password: string},
  ): Promise<{token: string; role: number}> {
    // <-- updated return type
    const {enrollment_number, password} = credentials;

    const user = await this.userRepo.findOne({
      where: {enrollment_number},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const userProfile: UserProfile = this.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    console.log('User:', user);
    console.log('Returning token and role:', {token, role: user.role});

    return {
      token,
      role: user.role!, // <-- include role in response
    };
  }

  /**
   * 🔒 Get Current Authenticated User Profile
   */
  @get('/me')
  @authenticate('jwt')
  async getCurrentUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  /**
   *
   */

  // @get('/check-enrollment')
  // async checkEnrollment(
  //   @param.query.string('enrollment_number') enrollment_number: string,
  // ): Promise<{status: number}> {
  //   const allowedEnrollmentNumbers = [
  //     '21105018',
  //     '21105020',
  //     '21105010',
  //     '21105034',
  //   ];

  //   if (allowedEnrollmentNumbers.includes(enrollment_number)) {
  //     return {status: 1};
  //   }
  //   return {status: 0}; // or you can throw an error or respond differently if not matched
  // }

  /**
   * 🔒 Convert User to UserProfile (for JWT payload)
   */
  convertToUserProfile(user: User): UserProfile {
    if (!user.id) {
      throw new HttpErrors.InternalServerError('User ID is missing');
    }

    return {
      [securityId]: user.id.toString(),
      name: user.enrollment_number,
      id: user.id,
      role: user.role,
    };
  }
}
