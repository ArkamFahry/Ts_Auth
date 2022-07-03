import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    type: String,
    description: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/[A-Z]/, {
    message: 'Password Needs To Have Capital letters',
  })
  @Matches(/[a-z]/, {
    message: 'Password Needs To Have Simple letters',
  })
  @Matches(/[0-9]/, {
    message: 'Password Needs To Have Numbers ( 0 - 9 )',
  })
  @Matches(/[$&!^?@#*]/, {
    message: 'Password Needs To Have Symbols ( $ & ! ^ ? @ # * )',
  })
  @Matches(/^\S*$/, {
    message: 'Spaces Are Not Allowed In The Password',
  })
  @MinLength(10)
  password: string;
}
