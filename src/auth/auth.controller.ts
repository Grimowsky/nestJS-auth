import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtAuthService,
  ) {}

  @Post('login')
  async login(@Body() userLogin: LoginDto) {
    await this.userService.findUser({ email: userLogin.email });
    return await this.authService.login(userLogin);
  }
  @Post('refresh-token')
  async refresh(@Body() data: { refresh_token: string }) {
    await this.jwtService.verify(data.refresh_token);
    const decodedUser = this.jwtService.decode(data.refresh_token);
    return {
      access_token: await this.jwtService.generateToken(decodedUser, {
        expiresIn: '30m',
      }),
      refresh_token: await this.jwtService.generateToken(decodedUser, {
        expiresIn: '30m',
      }),
    };
  }
}
