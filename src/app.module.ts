// src/app.module.ts

import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './typeorm/office.entity';
import { APP_PIPE, RouterModule } from '@nestjs/core';
import { OfficeModule } from './office/office.module';
import { Employees } from './typeorm/employees.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { EnvConfig } from './config';
import { CacheStoreModule, StoreType } from './cache-store';


function createConnection(options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "CONNECTED",
        options,
      });
    }, 5000);
  });
}


const OFFICE_ROUTES = [
  {
    path: "offices",
    module: OfficeModule,
  },
];
@Module({
  imports: [
    RouterModule.register(OFFICE_ROUTES),
    OfficeModule,
    CacheStoreModule.register({
      storeName: "YT-APP",
      storeType: StoreType.FILE,
      storeDir: __dirname, // dist folder
    }),
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
    AuthModule, 
    UsersModule
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
  {
    provide: EnvConfig,
    useValue: {
      env: "DEV",
      node: "17",
    },
  },

  {
    provide: "DATABASE_CONNECTION",
    // async provider for database connection
    useFactory: async (options: Record<string, any> = { user: "admin" }) => {
      const connection = await createConnection(options);

      return connection;
    },
    inject: [{ token: "DB_OPTIONS", optional: true }],
  },
  {
    provide: "DB_OPTIONS",
    useValue: { url: "localhost", user: "admin", password: "pwd" },
  },
  ],
})
export class AppModule { }
