import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  access_token_expiry,
  access_token_secret,
  refresh_token_expiry,
  refresh_token_secret,
} from './jwt_setting';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async sign_up(dto: SignUpDto) {
    const ifUserNameExists = await this.prisma.users.findUnique({
      where: {
        user_name: dto.user_name,
      },
    });

    if (ifUserNameExists)
      throw new ForbiddenException('User With this User Name Already Exists');

    const ifUserEmailExists = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (ifUserEmailExists)
      throw new ForbiddenException('User With this Email Already Exists');

    const IfRoleExists = await this.prisma.roles.findUnique({
      where: {
        role: dto.role,
      },
    });

    if (!IfRoleExists)
      throw new ForbiddenException('Theres No Such Role Defined');

    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.users.create({
      data: {
        user_name: dto.user_name,
        email: dto.email,
        password: hash,
        full_name: dto.full_name,
        role: dto.role,
        active: true,
      },
    });

    const allowedRoles = await this.prisma.roles.findMany({
      select: { role: true },
    });

    const roles = allowedRoles.map(({ role }) => {
      return role;
    });

    const access_token = await this.CreateAccessToken(
      newUser.id,
      newUser.email,
      newUser.user_name,
      newUser.full_name,
      newUser.role,
      roles,
    );

    const refresh_token = await this.CreateRefreshToken(newUser.id);

    await this.HashRefreshToken(newUser.id, refresh_token);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    };
  }

  async sign_in(dto: SignInDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('User Not Found');

    const matchPassword = await argon2.verify(user.password, dto.password);

    if (!matchPassword) throw new ForbiddenException('Wrong Password');

    const allowedRoles = await this.prisma.roles.findMany({
      select: { role: true },
    });

    const roles = allowedRoles.map(({ role }) => {
      return role;
    });

    const access_token = await this.CreateAccessToken(
      user.id,
      user.email,
      user.user_name,
      user.full_name,
      user.role,
      roles,
    );

    const refresh_token = await this.CreateRefreshToken(user.id);

    await this.HashRefreshToken(user.id, refresh_token);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  async logOut(user_id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user.hashed_rt === null && user.active === false)
      throw new ForbiddenException('User Has Already Logged Out');

    await this.prisma.users.updateMany({
      where: {
        id: user_id,
        hashed_rt: {
          not: null,
        },
        active: {
          not: false,
        },
      },
      data: {
        hashed_rt: null,
        active: false,
      },
    });

    return 'Logout Successful';
  }

  async refresh(user_id: string, refresh_token: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) throw new ForbiddenException('User Not Found');

    if (user.hashed_rt === null)
      throw new ForbiddenException('User Has Already Logged Out');

    const matchRefreshToken = await argon2.verify(
      user.hashed_rt,
      refresh_token,
    );

    if (!matchRefreshToken) throw new ForbiddenException('Wrong Refresh Token');

    const allowedRoles = await this.prisma.roles.findMany({
      select: { role: true },
    });

    const roles = allowedRoles.map(({ role }) => {
      return role;
    });

    const access_token = await this.CreateAccessToken(
      user.id,
      user.email,
      user.user_name,
      user.full_name,
      user.role,
      roles,
    );

    return {
      access_token: access_token,
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  async HashRefreshToken(user_id: string, refresh_token: string) {
    const hashed_refresh_token = await this.hashData(refresh_token);

    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        hashed_rt: hashed_refresh_token,
        active: true,
      },
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async CreateAccessToken(
    user_id: string,
    user_email: string,
    user_name: string,
    full_name: string,
    role: string,
    roles: string[],
  ) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: user_id,
        user_email: user_email,
        user_name: user_name,
        full_name: full_name,
        role: role,
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': user_id,
          'x-hasura-allowed-roles': roles,
          'x-hasura-default-role': role,
          'x-hasura-email': user_email,
          'x-hasura-user-name': user_name,
        },
      },
      {
        secret: access_token_secret,
        expiresIn: access_token_expiry,
      },
    );
    return access_token;
  }

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
