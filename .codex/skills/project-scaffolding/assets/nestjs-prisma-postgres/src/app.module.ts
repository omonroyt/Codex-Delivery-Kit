import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "./prisma.service";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { HealthController } from "./health.controller";
import { PaymentsController } from "./payments/payments.controller";
import { MessagesController } from "./messages/messages.controller";
import { AdminController } from "./admin/admin.controller";
import { AuthGuard } from "./auth/auth.guard";
import { RoleGuard } from "./auth/role.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "dev-secret-change-me",
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    PaymentsController,
    MessagesController,
    AdminController,
  ],
  providers: [PrismaService, AuthService, AuthGuard, RoleGuard],
})
export class AppModule {}
