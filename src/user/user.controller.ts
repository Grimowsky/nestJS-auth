import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request as Req } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //validation pipe is needed later
  @Post('register')
  async registerUser(@Body() user: CreateUserDto) {
    await this.userService.registerUser(user);
  }
  @Get('/')
  async users() {
    return this.userService.users();
  }
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUser({ id: id });
  }
  //some sort of response mapper might be needed
  @UseGuards(AuthGuard)
  @Get('/profile/:id')
  async getUserProfile(@Request() req: Req, @Param('id') id: string) {
    console.log('@@@ request', req);
    return this.userService.profile({ id: id });
  }
}
