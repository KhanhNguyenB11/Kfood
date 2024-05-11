import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from './types/user.types';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
@Resolver('User')
// @UseFilters
export class UserResolver {
  constructor(private readonly userService: UsersService) {}
  @Mutation(() => RegisterResponse)
  async Register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.password || !registerDto.name || !registerDto.email) {
      throw new BadRequestException('Please fill all the fields!');
    }
    const { activation_token } = await this.userService.registerUser(
      registerDto,
      context.res,
    );
    return { token: activation_token };
  }
  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationInput') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return this.userService.activateUser(activationDto, context.res);
  }
  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.loginUser({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.userService.getLoggedInUser(context.req);
  }
  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async logoutUser(@Context() context: { req: Request }) {
    return await this.userService.logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getAllUser();
  }
}
