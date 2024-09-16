import { BadRequestException } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { RegisterResponse } from "./types/user.types";
import { RegisterDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { Response } from "express";

@Resolver('user')
// @UseFilters
export class UsersResolver {
  constructor(
    private readonly userService: UsersService
  ) { }

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response }
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    const { user } = await this.userService.register(registerDto, context.res);

    return { user };
  }

  @Query(() => [User])
  async getUser() {
    return this.userService.getUser();
  }
}