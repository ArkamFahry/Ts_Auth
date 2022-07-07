import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { default_role } from './roles';
import {
  CreateAccessToken,
  CreateRefreshToken,
  HashRefreshToken,
} from './jwt_service';
import { HashData, VerifyData } from '../common/crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private createAt: CreateAccessToken,
    private createRt: CreateRefreshToken,
    private hashRt: HashRefreshToken,
    private Hash: HashData,
    private Verify: VerifyData,
  ) {}

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

    const hash = await this.Hash.hashData(dto.password);

    const newUser = await this.prisma.users.create({
      data: {
        user_name: dto.user_name,
        email: dto.email,
        password: hash,
        full_name: dto.full_name,
        role: default_role,
        active: true,
        metadata: dto.metadata,
      },
    });

    const allowedRoles = await this.prisma.roles.findMany({
      select: { role: true },
    });

    const roles = allowedRoles.map(({ role }) => {
      return role;
    });

    const access_token = await this.createAt.CreateAccessToken(
      newUser.id,
      newUser.email,
      newUser.user_name,
      newUser.full_name,
      newUser.role,
      roles,
      newUser.metadata,
    );

    const refresh_token = await this.createRt.CreateRefreshToken(newUser.id);

    await this.hashRt.HashRefreshToken(newUser.id, refresh_token);

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
        metadata: newUser.metadata,
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

    const matchPassword = await this.Verify.verifyData(
      user.password,
      dto.password,
    );

    if (!matchPassword) throw new ForbiddenException('Wrong Password');

    const allowedRoles = await this.prisma.roles.findMany({
      select: { role: true },
    });

    const roles = allowedRoles.map(({ role }) => {
      return role;
    });

    const access_token = await this.createAt.CreateAccessToken(
      user.id,
      user.email,
      user.user_name,
      user.full_name,
      user.role,
      roles,
      user.metadata,
    );

    const refresh_token = await this.createRt.CreateRefreshToken(user.id);

    await this.hashRt.HashRefreshToken(user.id, refresh_token);

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
        metadata: user.metadata,
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

    const matchRefreshToken = await this.Verify.verifyData(
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

    const access_token = await this.createAt.CreateAccessToken(
      user.id,
      user.email,
      user.user_name,
      user.full_name,
      user.role,
      roles,
      user.metadata,
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
        metadata: user.metadata,
      },
    };
  }
}
