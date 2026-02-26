import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  const port = Number(process.env.PORT || 3002);
  await app.listen(port, "0.0.0.0");
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
