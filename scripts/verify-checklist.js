#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

function parseArgs(argv) {
  const options = { projectPath: process.cwd(), allowEmpty: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--allow-empty") {
      options.allowEmpty = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      options.projectPath = path.resolve(arg);
    }
  }
  return options;
}

function findPackageManager(projectPath) {
  if (fs.existsSync(path.join(projectPath, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectPath, "yarn.lock"))) return "yarn";
  return "npm";
}

function loadPackageJson(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (error) {
    console.error(`[error] package.json invalido: ${error.message}`);
    return null;
  }
}

function runNodeChecks(projectPath) {
  const pkg = loadPackageJson(projectPath);
  if (!pkg || !pkg.scripts) {
    console.log("[skip] No package.json con scripts detectados.");
    return { ok: true, ran: false };
  }

  const manager = findPackageManager(projectPath);
  const checks = ["lint", "typecheck", "test", "build"];
  let ok = true;
  let ran = 0;

  for (const script of checks) {
    if (!pkg.scripts[script]) {
      console.log(`[skip] script '${script}' no definido.`);
      continue;
    }
    ran += 1;
    console.log(`[run] ${manager} run ${script}`);
    const passed = run(manager, ["run", script], projectPath);
    if (!passed) ok = false;
  }

  if (ran === 0) {
    console.error("[fail] Proyecto Node detectado sin scripts de verificacion (lint/typecheck/test/build).");
    return { ok: false, ran: false };
  }

  return { ok, ran: true };
}

function runPythonChecks(projectPath) {
  const pyproject = path.join(projectPath, "pyproject.toml");
  const requirements = path.join(projectPath, "requirements.txt");
  if (!fs.existsSync(pyproject) && !fs.existsSync(requirements)) {
    console.log("[skip] No proyecto Python detectado.");
    return { ok: true, ran: false };
  }

  console.log("[run] python -m pytest");
  const ok = run("python", ["-m", "pytest"], projectPath);
  return { ok, ran: true };
}

function runGoChecks(projectPath) {
  const goMod = path.join(projectPath, "go.mod");
  if (!fs.existsSync(goMod)) {
    console.log("[skip] No go.mod detectado.");
    return { ok: true, ran: false };
  }

  console.log("[run] go test ./...");
  const ok = run("go", ["test", "./..."], projectPath);
  return { ok, ran: true };
}

function runJavaChecks(projectPath) {
  const pom = path.join(projectPath, "pom.xml");
  if (!fs.existsSync(pom)) {
    console.log("[skip] No pom.xml detectado.");
    return { ok: true, ran: false };
  }

  console.log("[run] mvn -B test");
  const ok = run("mvn", ["-B", "test"], projectPath);
  return { ok, ran: true };
}

function main() {
  const options = parseArgs(process.argv);
  const projectPath = options.projectPath;

  console.log(`Verificando proyecto: ${projectPath}`);

  if (!fs.existsSync(projectPath)) {
    console.error("[error] ruta no existe.");
    process.exit(1);
  }

  const checks = [
    runNodeChecks(projectPath),
    runPythonChecks(projectPath),
    runGoChecks(projectPath),
    runJavaChecks(projectPath),
  ];

  const ranCount = checks.filter((item) => item.ran).length;
  const finalOk = checks.every((item) => item.ok);

  if (ranCount === 0) {
    if (options.allowEmpty) {
      console.log("[ok] No se detectaron runtimes validables (permitido por --allow-empty).");
      process.exit(0);
    }
    console.error("[fail] No se detecto ningun runtime validable. Pasa la ruta del proyecto (ej: node scripts/verify-checklist.js apps/api).");
    process.exit(1);
  }

  if (finalOk) {
    console.log("[ok] Checklist tecnico completado.");
    process.exit(0);
  }

  console.error("[fail] Checklist con errores.");
  process.exit(1);
}

main();
