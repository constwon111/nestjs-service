import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { Connection, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { UserEntity } from './entity/user.entity';
import { UserInfo } from './UserInfo';
import { ulid } from 'ulid';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private connection: Connection,
    private authService: AuthService,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    await this.saveUsersUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });

    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signUpVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);

    return;
  }

  private async saveUsersUsingTransaction(
    name: string,
    email: string,
    password: string,
    signUpVerifyToken: string,
  ) {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signUpVerifyToken = signUpVerifyToken;

      await manager.save(user);
      //   throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다
      //   user.name = 'test11';
      //   await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signUpVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signUpVerifyToken,
    );
  }
  async verifyEmail(signUpVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ signUpVerifyToken });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('Method not implementd');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('Method not implemented');
  }
}
