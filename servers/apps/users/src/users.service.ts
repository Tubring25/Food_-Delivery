import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jweService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // registerUser
  async register(registerDto: RegisterDto, response: Response)  {
    const {name, email, password, phone_number} = registerDto;

    const IsEmailExist = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (IsEmailExist) {
      throw new BadRequestException('Email already exist');
    }

    const isPhoneNumberExist = await this.prismaService.user.findUnique({
      where: { phone_number }
    })

    if (isPhoneNumberExist) {
      throw new BadRequestException('Phone number already exist');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        phone_number
      }
    });

    return {user, response}
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = {
      email,
      password
    }

    return user;
  }

  async getUser() {
    this.prismaService.user.findMany({});
  }
}
