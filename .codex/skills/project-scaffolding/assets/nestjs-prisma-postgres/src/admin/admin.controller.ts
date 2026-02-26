import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthGuard } from "../auth/auth.guard";
import { RoleGuard } from "../auth/role.guard";
import { RequireRole } from "../auth/role.decorator";

@Controller("admin")
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @RequireRole("admin")
  @Get("users")
  async listUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return { users };
  }
}

