import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserNameDto {
  @ApiProperty({ type: String, description: 'Prior user name' })
  @IsNotEmpty()
  @IsString()
  old_user_name: string;

  @ApiProperty({ type: String, description: 'A valid user name' })
  @IsNotEmpty()
  @IsString()
  new_user_name: string;
}
