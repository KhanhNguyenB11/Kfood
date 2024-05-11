import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/Prisma.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const accesstoken = req.headers.accesstoken as string;
    const refreshtoken = req.headers.refreshtoken as string;
    if (!accesstoken || !refreshtoken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }
    if (accesstoken) {
      const decoded = this.jwtService.verify(accesstoken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
      if (!decoded) {
        throw new UnauthorizedException('Invalid Accesstoken!');
      }
      await this.updateAccesstoken(req);
    }
    return true;
  }
  private async updateAccesstoken(req: any) {
    try {
      const refreshtokenData = req.headers.refreshtoken as string;
      const decoded = this.jwtService.decode(refreshtokenData);
      if (!decoded) {
        throw new UnauthorizedException('Invalid Accesstoken!');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      const accesstoken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '45m',
        },
      );
      const refreshtoken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );
      req.accesstoken = accesstoken;
      req.refreshtoken = refreshtoken;
      req.user = user;
    } catch (error) {
      console.log(error);
    }
  }
}
