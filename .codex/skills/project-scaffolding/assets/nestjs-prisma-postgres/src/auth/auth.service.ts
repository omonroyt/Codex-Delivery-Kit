import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { hashPassword, hashToken, verifyPassword } from "../common/security";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(input: { email: string; password: string; name?: string }) {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException("email_already_exists");
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(input.password),
        name: input.name || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return { user };
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("invalid_credentials");
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("invalid_credentials");
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role, tokenType: "access" },
      { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role, tokenType: "refresh" },
      { expiresIn: process.env.REFRESH_TOKEN_TTL || "7d" }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(process.env.REFRESH_TOKEN_DAYS || 7));

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string; role: string; tokenType?: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException("invalid_refresh_token");
    }

    if (payload.tokenType !== "refresh") {
      throw new UnauthorizedException("invalid_token_type");
    }

    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash: hashToken(refreshToken),
        revokedAt: null,
      },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("refresh_token_expired_or_revoked");
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: payload.sub, role: payload.role, tokenType: "access" },
      { expiresIn: process.env.ACCESS_TOKEN_TTL || "15m" }
    );

    return { accessToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash: hashToken(refreshToken),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}

