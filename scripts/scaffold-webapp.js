#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const templates = {
  "react-tailwind-vite": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "react-tailwind-vite"
  ),
  "angular-tailwind-cli": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "angular-tailwind-cli"
  ),
  "fastify-prisma-postgres": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "fastify-prisma-postgres"
  ),
  "nestjs-prisma-postgres": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "nestjs-prisma-postgres"
  ),
  "fastapi-postgres": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "fastapi-postgres"
  ),
  "go-gin-postgres": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "go-gin-postgres"
  ),
  "java-spring-postgres": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "java-spring-postgres"
  ),
  "terraform-aws-base": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "terraform-aws-base"
  ),
  "terraform-gcp-base": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "terraform-gcp-base"
  ),
  "terraform-azure-base": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "terraform-azure-base"
  ),
};

const verticalBlueprints = {
  saas: path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "verticals",
    "saas"
  ),
  ecommerce: path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "verticals",
    "ecommerce"
  ),
  marketplace: path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "verticals",
    "marketplace"
  ),
  "ai-heavy": path.join(
    __dirname,
    "..",
    ".codex",
    "skills",
    "project-scaffolding",
    "assets",
    "verticals",
    "ai-heavy"
  ),
};

function usage() {
  console.log("Uso 1 (template directo):");
  console.log(
    "  node scripts/scaffold-webapp.js --template <template> --target <ruta>"
  );
  console.log("");
  console.log("Uso 2 (preset + tipo):");
  console.log(
    "  node scripts/scaffold-webapp.js --preset <rapid|robust> --project-type <frontend|backend|fullstack> --frontend <react|angular> --backend-stack <fastify|nestjs|fastapi|go|java> --vertical <saas|ecommerce|marketplace|ai-heavy> --cloud <aws|gcp|azure> --target <ruta>"
  );
  console.log("");
  console.log("Templates:");
  Object.keys(templates).forEach((name) => console.log(`  - ${name}`));
}

function parseArgs(argv) {
  const args = {
    template: "",
    target: "",
    preset: "rapid",
    projectType: "",
    frontend: "react",
    backendStack: "",
    vertical: "",
    cloud: "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1] || "";
    if (key === "--template") args.template = value;
    if (key === "--target") args.target = value;
    if (key === "--preset") args.preset = value;
    if (key === "--project-type") args.projectType = value;
    if (key === "--frontend") args.frontend = value;
    if (key === "--backend-stack") args.backendStack = value;
    if (key === "--vertical") args.vertical = value;
    if (key === "--cloud") args.cloud = value;
  }

  return args;
}

function normalizePreset(preset) {
  const value = String(preset || "").toLowerCase();
  if (["rapid", "fast", "quick"].includes(value)) return "rapid";
  if (["robust", "secure", "safe"].includes(value)) return "robust";
  return value;
}

function normalizeProjectType(projectType) {
  const value = String(projectType || "").toLowerCase();
  if (["frontend", "backend", "fullstack"].includes(value)) return value;
  return value;
}

function normalizeFrontend(frontend) {
  const value = String(frontend || "").toLowerCase();
  if (["react", "angular"].includes(value)) return value;
  return value;
}

function normalizeBackendStack(backendStack) {
  const value = String(backendStack || "").toLowerCase();
  if (["fastify", "nestjs", "fastapi", "go", "java"].includes(value)) return value;
  return value;
}

function normalizeCloud(cloud) {
  const value = String(cloud || "").toLowerCase();
  if (["aws", "gcp", "azure"].includes(value)) return value;
  return value;
}

function backendTemplateFromStack(backendStack) {
  const map = {
    fastify: "fastify-prisma-postgres",
    nestjs: "nestjs-prisma-postgres",
    fastapi: "fastapi-postgres",
    go: "go-gin-postgres",
    java: "java-spring-postgres",
  };
  return map[backendStack] || "";
}

function frontendTemplateFromChoice(frontend) {
  return frontend === "angular" ? "angular-tailwind-cli" : "react-tailwind-vite";
}

function cloudTemplateFromProvider(cloud) {
  const map = {
    aws: "terraform-aws-base",
    gcp: "terraform-gcp-base",
    azure: "terraform-azure-base",
  };
  return map[cloud] || "";
}

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
    return;
  }
  fs.copyFileSync(src, dst);
}

function ensureEmptyOrMissing(destination) {
  if (fs.existsSync(destination) && fs.readdirSync(destination).length > 0) {
    throw new Error(`Destino no vacio: ${destination}`);
  }
  fs.mkdirSync(destination, { recursive: true });
}

function resolvePlan(options) {
  const plan = [];

  if (options.template) {
    if (!templates[options.template]) {
      throw new Error(`Template no soportado: ${options.template}`);
    }
    plan.push({
      template: options.template,
      relativeTarget: ".",
    });
    return plan;
  }

  const preset = normalizePreset(options.preset);
  const projectType = normalizeProjectType(options.projectType);
  const frontend = normalizeFrontend(options.frontend);
  const backendStack = normalizeBackendStack(options.backendStack);
  const cloud = normalizeCloud(options.cloud);

  if (!["rapid", "robust"].includes(preset)) {
    throw new Error(`Preset invalido: ${options.preset}`);
  }

  if (!["frontend", "backend", "fullstack"].includes(projectType)) {
    throw new Error(
      `Project type invalido: ${options.projectType}. Usa frontend|backend|fullstack`
    );
  }

  const frontendTemplate = frontendTemplateFromChoice(frontend);
  let backendTemplate = preset === "robust" ? "nestjs-prisma-postgres" : "fastify-prisma-postgres";
  if (backendStack) {
    backendTemplate = backendTemplateFromStack(backendStack);
    if (!backendTemplate) {
      throw new Error(
        `backend-stack invalido: ${options.backendStack}. Usa fastify|nestjs|fastapi|go|java`
      );
    }
  }

  if (projectType === "frontend") {
    plan.push({
      template: frontendTemplate,
      relativeTarget: ".",
    });
    return plan;
  }

  if (projectType === "backend") {
    plan.push({
      template: backendTemplate,
      relativeTarget: ".",
    });
    return plan;
  }

  // fullstack
  plan.push({
    template: frontendTemplate,
    relativeTarget: path.join("apps", "web"),
  });
  plan.push({
    template: backendTemplate,
    relativeTarget: path.join("apps", "api"),
  });

  if (cloud) {
    const cloudTemplate = cloudTemplateFromProvider(cloud);
    if (!cloudTemplate) {
      throw new Error(`cloud invalido: ${options.cloud}. Usa aws|gcp|azure`);
    }
    plan.push({
      template: cloudTemplate,
      relativeTarget: "infra",
    });
  }

  return plan;
}

function writeFullstackReadme(destination, options, plan) {
  const lines = [
    "# Fullstack Scaffold",
    "",
    "Estructura generada por Codex-Delivery-Kit.",
    "",
    `- preset: ${normalizePreset(options.preset)}`,
    `- project_type: ${normalizeProjectType(options.projectType)}`,
    `- frontend: ${normalizeFrontend(options.frontend)}`,
    `- backend_stack: ${normalizeBackendStack(options.backendStack) || "auto-by-preset"}`,
    `- vertical: ${options.vertical || "none"}`,
    `- cloud: ${normalizeCloud(options.cloud) || "none"}`,
    "",
    "## Componentes",
    "",
  ];

  for (const item of plan) {
    lines.push(`- ${item.relativeTarget}: ${item.template}`);
  }

  lines.push("");
  lines.push("## Siguientes pasos");
  lines.push("");
  lines.push("1. Entrar a apps/web y apps/api.");
  lines.push("2. Configurar entornos segun stack backend elegido.");
  lines.push("3. Levantar base de datos con docker compose en apps/api.");
  lines.push("4. Ejecutar migraciones + seed del backend.");
  lines.push("5. Si existe carpeta infra, ejecutar terraform init/plan/apply.");
  lines.push("");

  fs.writeFileSync(path.join(destination, "README.md"), lines.join("\n"), "utf8");
}

function nextStepsForTemplate(target, templateName) {
  if (templateName === "fastapi-postgres") {
    return [
      `cd ${target}`,
      "python -m venv .venv",
      ".venv\\Scripts\\activate (Windows) o source .venv/bin/activate",
      "pip install -r requirements.txt",
      "copiar .env.example a .env",
      "docker compose up -d",
      "alembic upgrade head",
      "python -m app.seed",
      "uvicorn app.main:app --reload",
    ];
  }

  if (templateName === "go-gin-postgres") {
    return [
      `cd ${target}`,
      "go mod tidy",
      "copiar .env.example a .env",
      "docker compose up -d",
      "go run ./...",
    ];
  }

  if (templateName === "java-spring-postgres") {
    return [
      `cd ${target}`,
      "copiar .env.example a .env",
      "docker compose up -d",
      "mvn flyway:migrate",
      "mvn spring-boot:run",
    ];
  }

  if (templateName === "fastify-prisma-postgres" || templateName === "nestjs-prisma-postgres") {
    return [
      `cd ${target}`,
      "npm install",
      "copiar .env.example a .env",
      "docker compose up -d",
      "npm run prisma:migrate:deploy",
      "npm run prisma:seed",
      "npm run dev",
    ];
  }

  if (templateName === "angular-tailwind-cli") {
    return [
      `cd ${target}`,
      "leer README.md",
      "ejecutar comandos Angular CLI + Tailwind",
    ];
  }

  if (templateName.startsWith("terraform-")) {
    return [
      `cd ${target}`,
      "terraform init",
      "terraform plan",
      "terraform apply",
    ];
  }

  return [`cd ${target}`, "npm install", "npm run dev"];
}

function printNumberedSteps(steps) {
  steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.target) {
    usage();
    process.exit(1);
  }

  const destination = path.resolve(process.cwd(), args.target);
  const plan = resolvePlan(args);

  if (!args.template && normalizeProjectType(args.projectType) === "fullstack") {
    ensureEmptyOrMissing(destination);
  } else {
    ensureEmptyOrMissing(destination);
  }

  for (const item of plan) {
    const source = templates[item.template];
    if (!fs.existsSync(source)) {
      throw new Error(`Template no encontrado: ${source}`);
    }
    const targetPath = path.resolve(destination, item.relativeTarget);
    fs.mkdirSync(targetPath, { recursive: true });
    copyRecursive(source, targetPath);
    console.log(`[ok] Copiado ${item.template} -> ${targetPath}`);
  }

  if (!args.template && normalizeProjectType(args.projectType) === "fullstack") {
    writeFullstackReadme(destination, args, plan);
  }

  if (
    !args.template &&
    normalizeProjectType(args.projectType) === "fullstack" &&
    args.vertical
  ) {
    const vertical = String(args.vertical).toLowerCase();
    const source = verticalBlueprints[vertical];
    if (!source || !fs.existsSync(source)) {
      throw new Error(
        `vertical invalido: ${args.vertical}. Usa saas|ecommerce|marketplace|ai-heavy`
      );
    }
    const verticalTarget = path.join(destination, "docs", "vertical");
    fs.mkdirSync(verticalTarget, { recursive: true });
    copyRecursive(source, verticalTarget);
    console.log(`[ok] Blueprint vertical aplicado: ${vertical}`);
  }

  console.log(`[ok] Proyecto base creado en: ${destination}`);
  if (args.template) {
    console.log(`[ok] Template usado: ${args.template}`);
  } else {
    console.log(
      `[ok] Modo usado: preset=${normalizePreset(args.preset)} type=${normalizeProjectType(args.projectType)} frontend=${normalizeFrontend(args.frontend)}`
    );
  }

  console.log("Siguientes pasos:");
  if (!args.template && normalizeProjectType(args.projectType) === "fullstack") {
    const frontendTemplate = frontendTemplateFromChoice(normalizeFrontend(args.frontend));
    const backendTemplate =
      backendTemplateFromStack(normalizeBackendStack(args.backendStack)) ||
      (normalizePreset(args.preset) === "robust" ? "nestjs-prisma-postgres" : "fastify-prisma-postgres");
    const cloudTemplate = cloudTemplateFromProvider(normalizeCloud(args.cloud));

    const steps = [];
    nextStepsForTemplate(`${args.target}/apps/web`, frontendTemplate).forEach((step) =>
      steps.push(`[web] ${step}`)
    );
    nextStepsForTemplate(`${args.target}/apps/api`, backendTemplate).forEach((step) =>
      steps.push(`[api] ${step}`)
    );
    if (cloudTemplate) {
      nextStepsForTemplate(`${args.target}/infra`, cloudTemplate).forEach((step) =>
        steps.push(`[infra] ${step}`)
      );
    }
    printNumberedSteps(steps);
  } else {
    const templateName =
      args.template ||
      (normalizeProjectType(args.projectType) === "backend"
        ? backendTemplateFromStack(normalizeBackendStack(args.backendStack)) ||
          (normalizePreset(args.preset) === "robust" ? "nestjs-prisma-postgres" : "fastify-prisma-postgres")
        : frontendTemplateFromChoice(normalizeFrontend(args.frontend)));

    const steps = nextStepsForTemplate(args.target, templateName);
    printNumberedSteps(steps);
  }
}

try {
  main();
} catch (error) {
  console.error(`[fail] ${error.message}`);
  usage();
  process.exit(1);
}
