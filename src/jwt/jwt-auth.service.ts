import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as nestJwt } from '@nestjs/jwt';
import { Request } from 'express';
import process from 'node:process';

@Injectable()
export class JwtAuthService {
  constructor(private jwt: nestJwt) {}

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  decode(token: string): { id: string } {
    return this.jwt.decode(token);
  }
  async verify(token: string) {
    try {
      await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
