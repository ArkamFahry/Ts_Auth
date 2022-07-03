import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({ type: String, description: 'A valid email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description:
      'A valid password minimum 10 characters needs to have capital letters, simple letters, numbers, symbols ( $ & ! ^ ? @ # * ) and Spaces are Not Allowed',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
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
  password: string;
}
