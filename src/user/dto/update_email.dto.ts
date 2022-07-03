import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailDto {
  @ApiProperty({ type: String, description: 'Prior email' })
  @IsNotEmpty()
  @IsEmail()
  old_email: string;

  @ApiProperty({ type: String, description: 'A valid email' })
  @IsNotEmpty()
  @IsEmail()
  new_email: string;
}
