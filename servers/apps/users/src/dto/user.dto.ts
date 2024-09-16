import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, minLength, MinLength } from 'class-validator';


@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({message: 'Name is required.'})
  @IsString({message: 'Name must be a string.'})
  name: string;

  @Field()
  @IsNotEmpty({message: 'Password is required.'})
  @MinLength(8, {message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({message: 'Email is required.'})
  @IsEmail({}, {message: 'Invalid email address.'})
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required.'})
  phone_number: number;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({message: 'Email is required.'})
  @IsEmail({}, {message: 'Invalid email address.'})
  email: string;

  @Field()
  @IsNotEmpty({message: 'Password is required.'})
  password: string;
}