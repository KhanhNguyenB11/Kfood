import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { EmailService } from './email/email.service';
import * as bcrypt from 'bcrypt';
import { TokenSender } from './utils/sendToken';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // register user
  async registerUser(registerDto: RegisterDto, res: Response) {
    const { name, email, password, phone_number } = registerDto;
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email already used! ');
    }
    if (isPhoneNumberExist) {
      throw new BadRequestException('Phone number already used! ');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashPassword,
      phone_number,
    };
    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const activation_token = activationToken.token;
    await this.emailService.sendMail({
      email,
      subject: 'Activate Your KFood Account',
      template: './activation-email',
      name,
      activationCode,
    });
    return { activation_token, res };
  }
  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }
  // activation service
  async activateUser(activationDto: ActivationDto, res: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, res };
  }
  // login service
  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found!');
    } else {
      if (await this.ComparePassword(password, user.password)) {
        const tokenSender = new TokenSender(
          this.configService,
          this.jwtService,
        );
        return tokenSender.sendToken(user);
      } else {
        return {
          user: null,
          accessToken: null,
          refreshToken: null,
          error: {
            message: 'Invalid credentials!',
          },
        };
      }
    }
  }
  async ComparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  // get logged in users
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    console.log({ user, refreshToken, accessToken });
    return { user, refreshToken, accessToken };
  }
  async logout(req: any) {
    req.user = null;
    req.refreshToken = null;
    req.accessToken = null;
    return { message: 'Logged out successfully!' };
  }
  // get all user
  async getAllUser() {
    return this.prisma.user.findMany();
  }
}
