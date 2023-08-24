
import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Global()
@Module({
  providers: [UsersService, { provide: 'UserSer', useClass: UsersService }],
  exports: [UsersService],
})
export class UsersModule { }