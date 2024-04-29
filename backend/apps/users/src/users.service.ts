import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { RegisterResponse } from './types/user.types';
import { response } from 'express';

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // register user
  async registerUser(registerDto: RegisterDto, res: Response) {
    const { name, email, password } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email already used! ');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    return { user, res };
  }
  // login service
  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password,
    };
    return user;
  }
  // get all user
  async getAllUser() {
    return this.prisma.user.findMany();
  }
}
