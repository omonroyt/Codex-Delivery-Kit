import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body() body: { email: string; password: string; name?: string }
  ) {
    return this.authService.register(body);
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post("refresh")
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post("logout")
  async logout(@Body() body: { refreshToken: string }) {
    if (body.refreshToken) {
      await this.authService.revokeRefreshToken(body.refreshToken);
    }
    return { status: "ok" };
  }

  @UseGuards(AuthGuard)
  @Get("me")
  me(@Req() req: { user: { sub: string } }) {
    return { user: req.user };
  }
}

