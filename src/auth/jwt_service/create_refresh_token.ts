import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { refresh_token_expiry, refresh_token_secret } from '../jwt_setting';

@Injectable()
export class CreateRefreshToken {
  constructor(private jwtService: JwtService) {}
  async CreateRefreshToken(user_id: string) {
    const refresh_token = await this.jwtService.signAsync(
      {
        sub: user_id,
      },
      {
        secret: refresh_token_secret,
        expiresIn: refresh_token_expiry,
      },
    );
    return refresh_token;
  }
}
