import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access_token_expiry, access_token_secret } from '../jwt_setting';

@Injectable()
export class CreateAccessToken {
  constructor(private jwtService: JwtService) {}
  async CreateAccessToken(
    user_id: string,
    user_email: string,
    user_name: string,
    full_name: string,
    role: string,
    roles: string[],
    metadata: any,
  ) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: user_id,
        user_email: user_email,
        user_name: user_name,
        full_name: full_name,
        role: role,
        allowed_roles: roles,
        metadata: metadata,
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': user_id,
          'x-hasura-allowed-roles': roles,
          'x-hasura-default-role': role,
          'x-hasura-email': user_email,
          'x-hasura-user-name': user_name,
          'x-hasura-metadata': metadata,
        },
      },
      {
        secret: access_token_secret,
        expiresIn: access_token_expiry,
      },
    );
    return access_token;
  }
}
