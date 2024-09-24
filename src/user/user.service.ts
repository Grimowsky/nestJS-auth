import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async registerUser(user: Prisma.usersCreateInput) {
    const hashedUserPass = await bcrypt.hash(user.password, 10);
    await this.db.users.create({ data: { ...user, password: hashedUserPass } });
  }
  async findUser(query: Prisma.usersWhereUniqueInput) {
    const user = await this.db.users.findFirst({
      where: query,
      select: { email: true, username: true },
    });

    if (!user) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
