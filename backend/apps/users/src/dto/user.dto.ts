import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required! ' })
  @IsString({ message: 'Name must be string. ' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required! ' })
  @IsEmail({}, { message: 'Email is invalid. ' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required! ' })
  phone_number: number;

  @Field()
  @IsNotEmpty({ message: 'Password is required! ' })
  @MinLength(8, { message: 'Password must be at least 8 characters. ' })
  password: string;
}
@InputType()
export class ActivationDto{
  @Field()
  @IsNotEmpty({ message: 'Activation code is required! ' })
  activationCode: string;


  @Field()
  @IsNotEmpty({ message: 'Token is required! ' })
  activationToken: string;



}
@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required! ' })
  @IsEmail({}, { message: 'Email is invalid. ' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required! ' })
  @MinLength(8, { message: 'Password must be at least 8 characters. ' })
  password: string;
}
