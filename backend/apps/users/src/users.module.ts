import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/Prisma.service';
import { UserResolver } from './user.resolver';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    PrismaService,
    UserResolver,
  ],
})
export class UsersModule {}
