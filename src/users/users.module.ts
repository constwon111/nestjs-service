import { Logger, Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config'

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
