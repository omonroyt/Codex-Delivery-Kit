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
    return true;
  }

  const manager = findPackageManager(projectPath);
  const checks = ["lint", "typecheck", "test", "build"];
  let ok = true;

  for (const script of checks) {
    if (!pkg.scripts[script]) {
      console.log(`[skip] script '${script}' no definido.`);
      continue;
    }
    console.log(`[run] ${manager} run ${script}`);
    const passed = run(manager, ["run", script], projectPath);
    if (!passed) ok = false;
  }

  return ok;
}

function runPythonChecks(projectPath) {
  const pyproject = path.join(projectPath, "pyproject.toml");
  const requirements = path.join(projectPath, "requirements.txt");
  if (!fs.existsSync(pyproject) && !fs.existsSync(requirements)) {
    console.log("[skip] No proyecto Python detectado.");
    return true;
  }

  let ok = true;
  console.log("[run] python -m pytest");
  if (!run("python", ["-m", "pytest"], projectPath)) ok = false;
  return ok;
}

function runGoChecks(projectPath) {
  const goMod = path.join(projectPath, "go.mod");
  if (!fs.existsSync(goMod)) {
    console.log("[skip] No go.mod detectado.");
    return true;
  }

  let ok = true;
  console.log("[run] go test ./...");
  if (!run("go", ["test", "./..."], projectPath)) ok = false;
  return ok;
}

function runJavaChecks(projectPath) {
  const pom = path.join(projectPath, "pom.xml");
  if (!fs.existsSync(pom)) {
    console.log("[skip] No pom.xml detectado.");
    return true;
  }

  let ok = true;
  console.log("[run] mvn -B test");
  if (!run("mvn", ["-B", "test"], projectPath)) ok = false;
  return ok;
}

function main() {
  const projectPath = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  console.log(`Verificando proyecto: ${projectPath}`);

  if (!fs.existsSync(projectPath)) {
    console.error("[error] ruta no existe.");
    process.exit(1);
  }

  const nodeOk = runNodeChecks(projectPath);
  const pythonOk = runPythonChecks(projectPath);
  const goOk = runGoChecks(projectPath);
  const javaOk = runJavaChecks(projectPath);
  const finalOk = nodeOk && pythonOk && goOk && javaOk;

  if (finalOk) {
    console.log("[ok] Checklist tecnico completado.");
    process.exit(0);
  }

  console.error("[fail] Checklist con errores.");
  process.exit(1);
}

main();
