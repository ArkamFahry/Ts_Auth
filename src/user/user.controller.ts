import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetCurrentUserId } from '../common/decorators';
import {
  DeleteUserDto,
  UpdateEmailDto,
  UpdateFullNameDto,
  UpdateMetadataDto,
  UpdatePasswordDto,
  UpdateRoleDto,
  UpdateUserNameDto,
} from './dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @Get('user')
  @HttpCode(HttpStatus.OK)
  get_user(@GetCurrentUserId() user_id: string) {
    return this.userService.get_user(user_id);
  }

  @ApiBearerAuth()
  @Delete('user/:email/:password')
  @HttpCode(HttpStatus.OK)
  async delete_user(
    @GetCurrentUserId() user_id: string,
    @Param() dto: DeleteUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const deleteUser = await this.userService.delete_user(
      user_id,
      dto.email,
      dto.password,
    );
    response.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 0),
    });

    response.send(deleteUser);
  }

  @ApiBearerAuth()
  @Put('user_name')
  @HttpCode(HttpStatus.OK)
  update_user_name(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdateUserNameDto,
  ) {
    return this.userService.update_user_name(user_id, dto);
  }

  @ApiBearerAuth()
  @Put('full_name')
  @HttpCode(HttpStatus.OK)
  update_user_full_name(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdateFullNameDto,
  ) {
    return this.userService.update_user_full_name(user_id, dto);
  }

  @ApiBearerAuth()
  @Put('email')
  @HttpCode(HttpStatus.OK)
  update_user_email(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdateEmailDto,
  ) {
    return this.userService.update_user_email(user_id, dto);
  }

  @ApiBearerAuth()
  @Put('role')
  @HttpCode(HttpStatus.OK)
  update_user_role(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.userService.update_user_role(user_id, dto);
  }

  @ApiBearerAuth()
  @Put('password')
  @HttpCode(HttpStatus.OK)
  update_user_password(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.update_user_password(user_id, dto);
  }

  @ApiBearerAuth()
  @Put('metadata')
  @HttpCode(HttpStatus.OK)
  update_user_metadata(
    @GetCurrentUserId() user_id: string,
    @Body() dto: UpdateMetadataDto,
  ) {
    return this.userService.update_user_metadata(user_id, dto);
  }
}
