import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as nestJwt, JwtSignOptions } from '@nestjs/jwt';
import { Request } from 'express';
import { CreateTokenDto } from './dto/create-token.dto';
import { DecodedUserDto } from '../auth/dto/decoded-user.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwt: nestJwt) {}

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  decode(token: string): DecodedUserDto {
    return this.jwt.decode(token);
  }
  async generateToken(userDetails: CreateTokenDto, options?: JwtSignOptions) {
    return await this.jwt.signAsync(
      {
        id: userDetails.id,
        username: userDetails.username,
      },
      options,
    );
  }
  async verify(token: string) {
    console.log('@@@', token);
    try {
      await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
