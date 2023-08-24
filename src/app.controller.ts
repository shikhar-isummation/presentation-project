import { Controller, Request, Post, UseGuards, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { EnvConfig } from './config';
import { CacheStoreService } from './cache-store';

@Controller()
export class AppController {
  constructor(@Inject("DATABASE_NAME") private dbname: string,

    @Inject("API_VERSION") private apiV: number,

    @Inject("DATABASE_CONNECTION") private dbConn: Record<string, any>,

    @Inject("MAIL") private emails: string[],

    @Inject("CRON_CONFIG") private cron: Record<string, any>,

    private config: EnvConfig,
    // no need to use @Inject, because injection token is a class `EnvConfig`,
    private authService: AuthService,

    private store: CacheStoreService
  ) {
    // console.log(`[AppService]:`, this.store);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    //user
    console.log('req.user', req.user);
    console.log("Inside [UsersController]:");
    //Db name Val
    console.log("String value (Database name): ", this.dbname);
    //num val
    console.log("Number value (Api version): ", this.apiV);
    //Email arr
    console.log("Array value (Mails): ", this.emails);
    //cron
    console.log("Object value (Cron config): ", this.cron);
    //config
    console.log("Object value with Class Injection token (EnvConfig): ", this.config);
    //db Connect
    console.log("Database connection", this.dbConn);

    return this.authService.login(req.user);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // } 

  // // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.CEO]))
  // @Get('sm')
  // getData(@Request() req) {
  //   return `I am CEO. \n ${JSON.stringify(req.user)}`;
  // }

  // // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.MANAGER, CONSTANTS.ROLES.CEO]))
  // @Get('wm')
  // getData1(@Request() req) {
  //   return `I am Manager.\n ${JSON.stringify(req.user)}`;
  // }
}