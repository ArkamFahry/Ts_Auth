import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Prior password',
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
  old_password: string;

  @ApiProperty({
    type: String,
    description:
      'A valid password minimum 10 characters needs to have capital letters, simple letters, numbers, symbols ( $ & ! ^ ? @ # * ) and Spaces are Not Allowed',
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
  new_password: string;
}
