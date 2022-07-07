import { Module } from '@nestjs/common';
import { HashData, VerifyData } from '../common/crypto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, HashData, VerifyData],
})
export class UserModule {}
