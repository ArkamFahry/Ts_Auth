import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    type: String,
    description: 'A pre-defined role from the database',
  })
  @IsNotEmpty()
  @IsString()
  new_role: string;
}
