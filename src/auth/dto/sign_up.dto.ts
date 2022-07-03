import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ type: String, description: 'A valid user name' })
  @IsNotEmpty()
  @IsString()
  user_name: string;

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

  @ApiProperty({
    type: String,
    description: "A valid full name can't have symbols or numbers",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: "full name can't have symbols or numbers",
  })
  full_name: string;

  @ApiProperty({
    type: String,
    description: 'A pre-defined role from the database',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
