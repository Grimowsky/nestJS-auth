import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async registerUser(user: Prisma.UsersCreateInput) {
    const hashedUserPass = await bcrypt.hash(user.password, 10);
    await this.db.users.create({ data: { ...user, password: hashedUserPass } });
  }
  async findUser(query: Prisma.UsersWhereUniqueInput) {
    const user = await this.db.users.findFirst({
      where: query,
      select: { email: true, username: true, id: true },
    });

    if (!user) {
      throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
  async users() {
    return this.db.users.findMany({
      select: { username: true, id: true, email: true },
    });
  }
  async profile(query: Prisma.UsersWhereInput) {
    const user = await this.db.users.findFirst({
      where: query,
      select: {
        email: true,
        id: true,
        username: true,
        profile: {
          select: {
            lastName: true,
            name: true,
            id: true,
          },
        },
      },
    });

    console.log('@@@', user);

    return user;
  }
}
