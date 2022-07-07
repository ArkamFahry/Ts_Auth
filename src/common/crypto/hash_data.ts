import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashData {
  hashData(data: string) {
    return argon2.hash(data);
  }
}
