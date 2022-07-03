import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    console.log(dto);
    return await this.usersService.verifyEmail(signupVerifyToken);
    // throw new Error('Method not implemented');
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<UserInfo> {
    console.log(dto);
    return;
  }

  @Get()
  async test() {
    console.log('hihihi');
  }

  @Get(':id')
  async getUserInfo(
    @Headers() headers: any,
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    const jwtString = headers.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);

    return this.usersService.getUserInfo(userId);
  }
}
