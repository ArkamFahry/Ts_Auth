import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import {
  UpdateEmailDto,
  UpdateFullNameDto,
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateUserNameDto,
} from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async get_user(user_id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        user_name: true,
        full_name: true,
        email: true,
        role: true,
        active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) throw new ForbiddenException('User Does Not Exist');

    return user;
  }

  async delete_user(user_id: string, email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
      select: {
        password: true,
        email: true,
      },
    });

    if (!user) throw new ForbiddenException('User Does Not Exist');

    if (user.email !== email)
      throw new ForbiddenException('Wrong Email Cannot Delete User Account');

    const matchPassword = await argon2.verify(user.password, password);

    if (!matchPassword)
      throw new ForbiddenException('Wrong Password Cannot Delete User Account');

    await this.prisma.users.delete({
      where: {
        id: user_id,
      },
    });

    return 'User Account Delete Successfully';
  }

  async update_user_name(user_id: string, dto: UpdateUserNameDto) {
    const ifUserNameExists = await this.prisma.users.findUnique({
      where: {
        user_name: dto.new_user_name,
      },
    });

    if (ifUserNameExists)
      throw new ForbiddenException('User With this User Name Already Exists');

    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user.user_name !== dto.old_user_name)
      throw new ForbiddenException('Wrong User Name');

    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        user_name: dto.new_user_name,
        updated_at: new Date(),
      },
    });

    return 'User Name Updated Successfully';
  }

  async update_user_full_name(user_id: string, dto: UpdateFullNameDto) {
    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        full_name: dto.new_full_name,
        updated_at: new Date(),
      },
    });

    return 'Full Name Updated Successfully';
  }

  async update_user_email(user_id: string, dto: UpdateEmailDto) {
    const ifUserEmailExists = await this.prisma.users.findUnique({
      where: {
        email: dto.new_email,
      },
      select: {
        email: true,
      },
    });

    if (ifUserEmailExists)
      throw new ForbiddenException('User With this Email Already Exists');

    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
      select: {
        email: true,
      },
    });

    if (user.email !== dto.old_email)
      throw new ForbiddenException('Wrong Email');

    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        email: dto.new_email,
        updated_at: new Date(),
      },
    });

    return 'Email Updated Successfully';
  }

  async update_user_role(user_id: string, dto: UpdateRoleDto) {
    const existingRoles = await this.prisma.roles.findUnique({
      where: {
        role: dto.new_role,
      },
      select: {
        role: true,
      },
    });

    if (!existingRoles)
      throw new ForbiddenException('Theres No Such Role Defined');

    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        role: dto.new_role,
        updated_at: new Date(),
      },
    });

    return 'Role Updated Successfully';
  }

  async update_user_password(user_id: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: user_id,
      },
      select: {
        password: true,
      },
    });

    const matchPassword = await argon2.verify(user.password, dto.old_password);

    if (!matchPassword) throw new ForbiddenException('Wrong Password');

    const hash = (await this.hashData(dto.new_password)).toString();

    await this.prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        password: hash,
        updated_at: new Date(),
      },
    });

    return 'Password Updated Successfully';
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
