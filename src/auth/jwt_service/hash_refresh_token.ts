import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HashData } from '../../common/crypto';

@Injectable()
export class HashRefreshToken {
  constructor(private prisma: PrismaService, private Hash: HashData) {}
  async HashRefreshToken(user_id: string, refresh_token: string) {
    const hashed_refresh_token = await this.Hash.hashData(refresh_token);

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
}
