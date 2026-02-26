import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @Post("checkout")
  async checkout(
    @Req() req: { user: { sub: string } },
    @Body() body: { amount: number; currency?: string; provider?: string }
  ) {
    const payment = await this.prisma.payment.create({
      data: {
        userId: req.user.sub,
        amount: Math.round(Number(body.amount || 0)),
        currency: body.currency || "USD",
        provider: body.provider || "mock",
        status: "PENDING",
      },
    });

    return {
      payment,
      nextAction: "connect_real_payment_provider",
    };
  }
}

