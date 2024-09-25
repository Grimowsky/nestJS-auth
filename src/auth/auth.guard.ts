import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.jwtService.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    return await this.jwtService.verify(token);
  }
}
