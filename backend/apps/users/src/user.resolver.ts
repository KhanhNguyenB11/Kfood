import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterResponse } from './types/user.types';
import { RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
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
    const user = await this.userService.registerUser(registerDto, context.res);
    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getAllUser();
  }
}
