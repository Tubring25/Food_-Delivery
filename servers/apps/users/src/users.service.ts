import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jweService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: EmailService
  ) { }

  // registerUser
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;

    const IsEmailExist = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if (IsEmailExist) {
      throw new BadRequestException('Email already exist');
    }

    const isPhoneNumberExist = await this.prismaService.user.findUnique({
      where: {
        phone_number
      }
    });

    if (isPhoneNumberExist) {
      throw new BadRequestException('Phone number already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;

    await this.mailService.sendMail({
      subject: 'Account Activation',
      email,
      name,
      activationCode,
      template: './activation-mail'
    })


    return { user, response }
  }

  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jweService.sign(
      {
        user, activationCode
      },
      {
        secret: this.configService.get<string>('ACTIVATION_TOKEN_SECRET'),
        expiresIn: '5m'
      }
    )

    return { token, activationCode }
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
