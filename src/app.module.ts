import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EmailService, UsersService],
})
export class AppModule {}
