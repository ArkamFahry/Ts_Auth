import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashData, VerifyData } from '../common/crypto';
import {
  CreateAccessToken,
  CreateRefreshToken,
  HashRefreshToken,
} from './jwt_service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    CreateAccessToken,
    CreateRefreshToken,
    HashRefreshToken,
    HashData,
    VerifyData,
  ],
})
export class AuthModule {}
