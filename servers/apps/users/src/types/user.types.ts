import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({nullable: true})
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, {nullable: true})
  user?: User;

  @Field(() => ErrorType, {nullable: true})
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field(() => ErrorType, {nullable: true})
  error?: ErrorType;
}