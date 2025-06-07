import {injectable, BindingScope} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn = '1h';

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET ?? 'your-secret-key';
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('UserProfile is null');
    }

    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        userProfile,
        this.jwtSecret,
        {expiresIn: this.jwtExpiresIn},
        (err, token) => {
          if (err || !token) {
            reject(err);
          } else {
            resolve(token);
          }
        },
      );
    });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Token not provided');
    }

    return new Promise<UserProfile>((resolve, reject) => {
      jwt.verify(token, this.jwtSecret, (err, decoded) => {
        if (err || !decoded) {
          reject(new HttpErrors.Unauthorized('Invalid token'));
        } else {
          resolve(decoded as UserProfile);
        }
      });
    });
  }
}
