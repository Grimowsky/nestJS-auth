import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async comparePassword(
    loginPassword: string,
    hashedPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(loginPassword, hashedPass);
  }

  private nonExistingUserException() {
    throw new HttpException(
      'User does not exist or password does not match',
      HttpStatus.BAD_REQUEST,
    );
  }

  async login(loginDetails: LoginDto) {
    const user = await this.db.users.findUnique({
      where: { email: loginDetails.email },
    });

    if (!user) {
      return this.nonExistingUserException();
    }

    if (await this.comparePassword(loginDetails.password, user.password)) {
      return {
        access_token: await this.jwtService.signAsync({
          id: user.id,
          username: user.username,
        }),
      };
    }
  }
}
