import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //validation pipe is needed later
  @Post('register')
  async registerUser(@Body() user: CreateUserDto) {
    await this.userService.registerUser(user);
  }
  @Get('/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userService.findUser({ email: email });
  }
}
