import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtAuthService],
})
export class UserModule {}
