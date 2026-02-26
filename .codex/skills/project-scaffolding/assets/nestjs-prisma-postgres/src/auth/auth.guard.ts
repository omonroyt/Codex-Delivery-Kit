import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("missing_token");
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.tokenType && payload.tokenType !== "access") {
        throw new UnauthorizedException("invalid_token_type");
      }
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("invalid_token");
    }
  }
}

