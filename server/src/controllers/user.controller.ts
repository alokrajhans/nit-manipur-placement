// import {post, requestBody, HttpErrors} from '@loopback/rest';
// import {repository} from '@loopback/repository';
// import {UserRepository} from '../repositories';
// import {RegisterRequest} from '../dtos/register.dto';
// import {hash} from 'bcryptjs';

// export class UserController {
//   constructor(
//     @repository(UserRepository)
//     public userRepository: UserRepository,
//   ) {}

//   @post('/register')
//   async register(
//     @requestBody() newUserRequest: RegisterRequest,
//   ): Promise<{message: string; userId?: number}> {
//     const {enrollment_number, password} = newUserRequest;

//     // Basic validation
//     if (!enrollment_number?.trim()) {
//       throw new HttpErrors.BadRequest('Enrollment number is required');
//     }
//     if (!password || password.length < 6) {
//       throw new HttpErrors.BadRequest('Password is required and must be at least 6 characters');
//     }

//     try {
//       // Check if user already exists
//       const existingUser = await this.userRepository.findOne({
//         where: {enrollment_number},
//       });

//       if (existingUser) {
//         throw new HttpErrors.BadRequest('Enrollment number already registered');
//       }

//       // Hash password
//       const hashedPassword = await hash(password, 10);

//       // Create user
//       const savedUser = await this.userRepository.create({
//         enrollment_number,
//         password: hashedPassword,
//         // email: newUserRequest.email, // optional, if added to DTO/model
//       });

//       return {
//         message: 'User registered successfully',
//         userId: savedUser.id,
//       };
//     } catch (error) {
//       throw error; // You can customize error handling here if needed
//     }
//   }
// }
