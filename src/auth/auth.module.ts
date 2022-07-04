import { Module } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
