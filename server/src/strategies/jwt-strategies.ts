import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {Request} from '@loopback/rest';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import { JWTService } from '../service/jwt-service';
// import { JWTService } from 'src/service/services/jwt-service';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject('services.jwt.service')
    public jwtService: JWTService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);

    if (!userProfile) {
      throw new HttpErrors.Unauthorized(`Invalid token`);
    }

    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found.');
    }
    // Authorization: Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(`Authorization header is not of type 'Bearer'.`);
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(`Authorization header value has too many parts.`);
    }

    const token = parts[1];
    return token;
  }
}
