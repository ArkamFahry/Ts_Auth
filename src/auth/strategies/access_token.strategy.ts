import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { access_token_secret } from '../jwt_setting';

type AccessJwtPayload = {
  sub: string;
  user_email: string;
  user_name: string;
  full_name: string;
  role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: access_token_secret,
    });
  }

  validate(payload: AccessJwtPayload) {
    return payload;
  }
}
