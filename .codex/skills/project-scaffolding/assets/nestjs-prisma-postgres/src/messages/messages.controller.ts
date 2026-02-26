import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("messages")
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @Post("send")
  async send(
    @Req() req: { user: { sub: string } },
    @Body() body: { payload: string; channel?: string }
  ) {
    const message = await this.prisma.message.create({
      data: {
        senderId: req.user.sub,
        payload: body.payload,
        channel: body.channel || "in_app",
        status: "QUEUED",
      },
    });
    return {
      message,
      nextAction: "connect_queue_or_provider",
    };
  }
}

