import { Module, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, { provide: "authSer", useExisting: AuthService }, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule implements OnModuleInit {
  onModuleInit() {
    console.log("AuthModule module init");
  }
}