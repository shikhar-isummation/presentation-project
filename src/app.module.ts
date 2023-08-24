// src/app.module.ts

import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './typeorm/office.entity';
import { APP_PIPE } from '@nestjs/core';
import { OfficeController } from './office/offices.controller';
import { OfficeModule } from './office/office.module';
import { Employees } from './typeorm/employees.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { EnvConfig } from './config';

@Module({
  imports: [OfficeModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'classicmodels',
      entities: [Office, Employees],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Office, Employees]),
    AuthModule, UsersModule
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },
  // `string` value provider
  {
    provide: "DATABASE_NAME",
    useValue: "moon_knight",
  },

  // `number` value provider
  {
    provide: "API_VERSION",
    useValue: 2,
  },

  // `array` value provider
  {
    provide: "MAIL",
    useValue: ["admin@domain.com", "replay@domain.com"],
  },

  // `object` value provider
  {
    provide: "CRON_CONFIG",
    useValue: {
      max: 11,
      runOn: "start",
    },
  },

  // `object` value provider

  // NOTE: injection token can be `class`, `string`, or `symbol`
  // here we are using class as token
  {
    provide: EnvConfig,
    useValue: {
      env: "DEV",
      node: "17",
    },
  },
  ],
})
export class AppModule { }
