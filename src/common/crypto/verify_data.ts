import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class VerifyData {
  verifyData(hash: string, value: string) {
    return argon2.verify(hash, value);
  }
}
