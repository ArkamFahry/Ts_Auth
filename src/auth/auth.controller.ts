import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { RefreshTokenGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ac_expires, lg_expire_time, rt_expire_time } from './jwt_setting';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign_up')
  @HttpCode(HttpStatus.CREATED)
  async sign_up(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signUp = await this.authService.sign_up(dto);
    response.cookie('refresh_token', signUp.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + rt_expire_time),
    });
    response.send({
      access_token: signUp.access_token,
      expires: ac_expires,
      user: signUp.user,
    });
  }

  @Public()
  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  async sign_in(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const signIn = await this.authService.sign_in(dto);
    response.cookie('refresh_token', signIn.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + rt_expire_time),
    });
    response.send({
      access_token: signIn.access_token,
      expires: ac_expires,
      user: signIn.user,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() user_id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const logOut = await this.authService.logOut(user_id);
    response.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(Date.now() + lg_expire_time),
      secure: false,
    });

    response.send(logOut);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() user_id: string,
    @GetCurrentUser('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const reFresh = await this.authService.refresh(user_id, refresh_token);
    response.send({
      access_token: reFresh.access_token,
      expires: ac_expires,
      user: reFresh.user,
    });
  }
}
