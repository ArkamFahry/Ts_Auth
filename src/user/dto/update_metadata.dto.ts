import { ApiProperty } from '@nestjs/swagger';

export class UpdateMetadataDto {
  @ApiProperty({
    type: JSON,
    description: 'A valid Json Object',
  })
  metadata: any;
}
