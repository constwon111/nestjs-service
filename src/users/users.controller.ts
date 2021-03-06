import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  LoggerService,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InternalServerErrorException } from '@nestjs/common';
// import { AuthGuard } from 'src/guard/auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Controller('/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    const result = await this.usersService.verifyEmail(signupVerifyToken);
    return result;
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

  @UseGuards(AuthGuard())
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId);
  }
}
