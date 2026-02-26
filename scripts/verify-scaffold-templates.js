#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function resolveCommand(command) {
  if (process.platform === "win32" && command === "node") return process.execPath;
  return command;
}

function run(command, args, cwd, timeoutMs = 300000) {
  const useShellCompat = process.platform === "win32" && command === "npm";
  const result = useShellCompat
    ? spawnSync(command, args, {
        cwd,
        stdio: "inherit",
        timeout: timeoutMs,
        shell: true,
      })
    : spawnSync(resolveCommand(command), args, {
        cwd,
        stdio: "inherit",
        timeout: timeoutMs,
      });

  if (result.error) {
    if (result.error.code === "ETIMEDOUT") {
      console.error(`[fail] Timeout ejecutando ${command} (${timeoutMs} ms)`);
      return false;
    }
    console.error(`[fail] Error ejecutando ${command}: ${result.error.message}`);
    return false;
  }
  return result.status === 0;
}

function assertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo esperado no encontrado: ${filePath}`);
  }
}

function removeIfExists(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
  } catch (error) {
    console.warn(`[warn] No se pudo limpiar temporal: ${targetPath} (${error.code || "error"})`);
  }
}

function parseArgs(argv) {
  return {
    withInstall: argv.includes("--with-install"),
    keepTemp: argv.includes("--keep-temp"),
  };
}

function installAndBuildNodeProject(projectPath, label) {
  console.log(`[run] npm install ${label}`);
  if (
    !run(
      "npm",
      ["install", "--no-audit", "--no-fund", "--fetch-timeout=120000"],
      projectPath,
      300000
    )
  ) {
    throw new Error(`Fallo npm install en ${label}`);
  }

  console.log(`[run] npm run build ${label}`);
  if (!run("npm", ["run", "build"], projectPath, 300000)) {
    throw new Error(`Fallo npm run build en ${label}`);
  }
}

function main() {
  const options = parseArgs(process.argv);
  const repoRoot = path.resolve(__dirname, "..");
  const tmpRoot = path.join(repoRoot, ".tmp-template-ci");

  const targets = {
    react: path.join(repoRoot, ".tmp-template-ci", "react-app"),
    angular: path.join(repoRoot, ".tmp-template-ci", "angular-template"),
    fastify: path.join(repoRoot, ".tmp-template-ci", "fastify-api"),
    nest: path.join(repoRoot, ".tmp-template-ci", "nest-api"),
    fastapi: path.join(repoRoot, ".tmp-template-ci", "fastapi-api"),
    go: path.join(repoRoot, ".tmp-template-ci", "go-api"),
    java: path.join(repoRoot, ".tmp-template-ci", "java-api"),
    tfAws: path.join(repoRoot, ".tmp-template-ci", "infra-aws"),
    tfGcp: path.join(repoRoot, ".tmp-template-ci", "infra-gcp"),
    tfAzure: path.join(repoRoot, ".tmp-template-ci", "infra-azure"),
    fullstackRapid: path.join(repoRoot, ".tmp-template-ci", "fullstack-rapid"),
    fullstackRobust: path.join(repoRoot, ".tmp-template-ci", "fullstack-robust"),
    fullstackCloud: path.join(repoRoot, ".tmp-template-ci", "fullstack-cloud"),
  };

  removeIfExists(tmpRoot);
  fs.mkdirSync(tmpRoot, { recursive: true });

  try {
    console.log("[run] scaffold react-tailwind-vite");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "react-tailwind-vite",
          "--target",
          path.join(".tmp-template-ci", "react-app"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding react-tailwind-vite");
    }

    console.log("[run] scaffold angular-tailwind-cli");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "angular-tailwind-cli",
          "--target",
          path.join(".tmp-template-ci", "angular-template"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding angular-tailwind-cli");
    }

    console.log("[run] scaffold fastify-prisma-postgres");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "fastify-prisma-postgres",
          "--target",
          path.join(".tmp-template-ci", "fastify-api"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding fastify-prisma-postgres");
    }

    console.log("[run] scaffold nestjs-prisma-postgres");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "nestjs-prisma-postgres",
          "--target",
          path.join(".tmp-template-ci", "nest-api"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding nestjs-prisma-postgres");
    }

    console.log("[run] scaffold fastapi-postgres");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "fastapi-postgres",
          "--target",
          path.join(".tmp-template-ci", "fastapi-api"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding fastapi-postgres");
    }

    console.log("[run] scaffold go-gin-postgres");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "go-gin-postgres",
          "--target",
          path.join(".tmp-template-ci", "go-api"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding go-gin-postgres");
    }

    console.log("[run] scaffold java-spring-postgres");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "java-spring-postgres",
          "--target",
          path.join(".tmp-template-ci", "java-api"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding java-spring-postgres");
    }

    console.log("[run] scaffold terraform-aws-base");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "terraform-aws-base",
          "--target",
          path.join(".tmp-template-ci", "infra-aws"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding terraform-aws-base");
    }

    console.log("[run] scaffold terraform-gcp-base");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "terraform-gcp-base",
          "--target",
          path.join(".tmp-template-ci", "infra-gcp"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding terraform-gcp-base");
    }

    console.log("[run] scaffold terraform-azure-base");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--template",
          "terraform-azure-base",
          "--target",
          path.join(".tmp-template-ci", "infra-azure"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding terraform-azure-base");
    }

    console.log("[run] scaffold preset rapid fullstack");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--preset",
          "rapid",
          "--project-type",
          "fullstack",
          "--frontend",
          "react",
          "--target",
          path.join(".tmp-template-ci", "fullstack-rapid"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding fullstack rapid");
    }

    console.log("[run] scaffold preset robust fullstack");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--preset",
          "robust",
          "--project-type",
          "fullstack",
          "--frontend",
          "angular",
          "--target",
          path.join(".tmp-template-ci", "fullstack-robust"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding fullstack robust");
    }

    console.log("[run] scaffold preset rapid fullstack + cloud");
    if (
      !run(
        "node",
        [
          "scripts/scaffold-webapp.js",
          "--preset",
          "rapid",
          "--project-type",
          "fullstack",
          "--frontend",
          "react",
          "--cloud",
          "aws",
          "--target",
          path.join(".tmp-template-ci", "fullstack-cloud"),
        ],
        repoRoot
      )
    ) {
      throw new Error("Fallo scaffolding fullstack cloud");
    }

    // direct templates
    assertFile(path.join(targets.react, "package.json"));
    assertFile(path.join(targets.react, "src", "main.tsx"));
    assertFile(path.join(targets.react, "src", "App.test.tsx"));
    assertFile(path.join(targets.react, "Dockerfile"));
    assertFile(path.join(targets.react, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.react, "tailwind.config.cjs"));
    assertFile(path.join(targets.angular, "README.md"));
    assertFile(path.join(targets.fastify, "package.json"));
    assertFile(path.join(targets.fastify, "prisma", "schema.prisma"));
    assertFile(
      path.join(
        targets.fastify,
        "prisma",
        "migrations",
        "202602260001_init",
        "migration.sql"
      )
    );
    assertFile(path.join(targets.fastify, "tests", "auth-flow.test.ts"));
    assertFile(path.join(targets.fastify, "Dockerfile"));
    assertFile(path.join(targets.fastify, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.fastify, "docker-compose.yml"));
    assertFile(path.join(targets.nest, "package.json"));
    assertFile(path.join(targets.nest, "src", "main.ts"));
    assertFile(path.join(targets.nest, "prisma", "schema.prisma"));
    assertFile(
      path.join(
        targets.nest,
        "prisma",
        "migrations",
        "202602260001_init",
        "migration.sql"
      )
    );
    assertFile(path.join(targets.nest, "test", "auth.e2e.spec.ts"));
    assertFile(path.join(targets.nest, "Dockerfile"));
    assertFile(path.join(targets.nest, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.fastapi, "requirements.txt"));
    assertFile(path.join(targets.fastapi, "app", "main.py"));
    assertFile(path.join(targets.fastapi, "alembic.ini"));
    assertFile(
      path.join(targets.fastapi, "alembic", "versions", "20260226_0001_init.py")
    );
    assertFile(path.join(targets.fastapi, "tests", "test_auth_e2e.py"));
    assertFile(path.join(targets.fastapi, "Dockerfile"));
    assertFile(path.join(targets.fastapi, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.go, "go.mod"));
    assertFile(path.join(targets.go, "main.go"));
    assertFile(path.join(targets.go, "migrations", "001_init.sql"));
    assertFile(path.join(targets.go, "seed", "001_seed.sql"));
    assertFile(path.join(targets.go, "Dockerfile"));
    assertFile(path.join(targets.go, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.java, "pom.xml"));
    assertFile(path.join(targets.java, "src", "main", "java", "com", "codexkit", "template", "Application.java"));
    assertFile(
      path.join(
        targets.java,
        "src",
        "main",
        "resources",
        "db",
        "migration",
        "V1__init.sql"
      )
    );
    assertFile(
      path.join(
        targets.java,
        "src",
        "test",
        "java",
        "com",
        "codexkit",
        "template",
        "AuthFlowTest.java"
      )
    );
    assertFile(path.join(targets.java, "Dockerfile"));
    assertFile(path.join(targets.java, ".github", "workflows", "ci-cd.yml"));
    assertFile(path.join(targets.tfAws, "main.tf"));
    assertFile(path.join(targets.tfGcp, "main.tf"));
    assertFile(path.join(targets.tfAzure, "main.tf"));

    // preset fullstack structure
    assertFile(path.join(targets.fullstackRapid, "apps", "web", "package.json"));
    assertFile(path.join(targets.fullstackRapid, "apps", "api", "package.json"));
    assertFile(path.join(targets.fullstackRobust, "apps", "web", "README.md"));
    assertFile(path.join(targets.fullstackRobust, "apps", "api", "package.json"));
    assertFile(path.join(targets.fullstackCloud, "infra", "main.tf"));

    if (options.withInstall) {
      installAndBuildNodeProject(targets.react, "react template");
      console.log("[run] npm test react template");
      if (!run("npm", ["run", "test"], targets.react, 180000)) {
        throw new Error("Fallo npm run test en react template");
      }
      installAndBuildNodeProject(targets.fastify, "fastify template");
      installAndBuildNodeProject(targets.nest, "nestjs template");
    } else {
      console.log("[skip] install/build omitido (usar --with-install)");
    }

    console.log("[ok] Verificacion de templates completada.");
  } finally {
    if (!options.keepTemp) {
      removeIfExists(tmpRoot);
    } else {
      console.log(`[info] Temp preservado en: ${tmpRoot}`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`[fail] ${error.message}`);
  process.exit(1);
}
