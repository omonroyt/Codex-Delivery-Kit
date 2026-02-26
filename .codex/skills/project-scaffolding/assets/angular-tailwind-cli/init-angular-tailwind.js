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
  const options = { dryRun: false, name: "my-angular-app" };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1] || "";
    if (key === "--dry-run") options.dryRun = true;
    if (key === "--name") options.name = value || options.name;
  }
  return options;
}

function writeTailwindConfig(appPath) {
  const configPath = path.join(appPath, "tailwind.config.js");
  const content = [
    "/** @type {import('tailwindcss').Config} */" ,
    "module.exports = {" ,
    "  content: ['./src/**/*.{html,ts}']," ,
    "  theme: {" ,
    "    extend: {}," ,
    "  }," ,
    "  plugins: []," ,
    "};" ,
    "" ,
  ].join("\n");
  fs.writeFileSync(configPath, content, "utf8");
}

function writeStyles(appPath) {
  const stylesPath = path.join(appPath, "src", "styles.css");
  const content = [
    "@tailwind base;" ,
    "@tailwind components;" ,
    "@tailwind utilities;" ,
    "" ,
  ].join("\n");
  fs.writeFileSync(stylesPath, content, "utf8");
}

function main() {
  const options = parseArgs(process.argv);
  const rootPath = process.cwd();
  const appName = options.name.trim();

  if (!appName) {
    console.error("[fail] Debes definir --name <app-name>");
    process.exit(1);
  }

  const appPath = path.join(rootPath, appName);

  if (options.dryRun) {
    console.log("[dry-run] Comandos a ejecutar:");
    console.log(`1. npm create @angular@latest ${appName} -- --routing --style css --ssr false --skip-git --package-manager npm`);
    console.log(`2. cd ${appName}`);
    console.log("3. npm install -D tailwindcss postcss autoprefixer");
    console.log("4. npx tailwindcss init");
    console.log("5. Escribir tailwind.config.js y src/styles.css");
    process.exit(0);
  }

  if (fs.existsSync(appPath)) {
    console.error(`[fail] Destino ya existe: ${appPath}`);
    process.exit(1);
  }

  const createArgs = [
    "create",
    "@angular@latest",
    appName,
    "--",
    "--routing",
    "--style",
    "css",
    "--ssr",
    "false",
    "--skip-git",
    "--package-manager",
    "npm",
  ];

  console.log("[run] Creando app Angular...");
  if (!run("npm", createArgs, rootPath)) {
    console.error("[fail] No se pudo crear el proyecto Angular.");
    process.exit(1);
  }

  console.log("[run] Instalando Tailwind...");
  if (!run("npm", ["install", "-D", "tailwindcss", "postcss", "autoprefixer"], appPath)) {
    console.error("[fail] No se pudo instalar Tailwind.");
    process.exit(1);
  }

  console.log("[run] Generando configuración de Tailwind...");
  if (!run("npx", ["tailwindcss", "init"], appPath)) {
    console.error("[fail] No se pudo generar tailwind.config.js");
    process.exit(1);
  }

  writeTailwindConfig(appPath);
  writeStyles(appPath);

  console.log("[ok] Angular + Tailwind inicializado.");
  console.log(`[ok] Ruta: ${appPath}`);
  console.log("Siguientes pasos:");
  console.log(`1. cd ${appName}`);
  console.log("2. npm run start");
}

main();
