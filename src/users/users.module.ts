
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';

@Global()
@Module({
  providers: [UsersService, { provide: 'UserSer', useClass: UsersService }],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  onModuleInit() {
    console.log("User module init");
  }
}