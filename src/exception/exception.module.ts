import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
// import { Logger } from 'winston';
import { Logger } from '@nestjs/common';
@Module({
  providers: [Logger, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class ExceptionModule {}
