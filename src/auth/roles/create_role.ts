import { PrismaService } from '../../prisma/prisma.service';
import { add_roles } from './add_roles';

export class CreateRoles {
  constructor(private prisma: PrismaService) {}
  async CreateRoles() {
    add_roles.forEach(async (role) => {
      await this.prisma.roles.create({
        data: {
          role: role,
        },
      });
    });
  }
}
