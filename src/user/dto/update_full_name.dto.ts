import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateFullNameDto {
  @ApiProperty({
    type: String,
    description: "A valid full name can't have symbols or numbers",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: "full name can't have symbols or numbers",
  })
  new_full_name: string;
}
