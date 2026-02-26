#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

function ask(rl, question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      const value = answer.trim();
      resolve(value || defaultValue);
    });
  });
}

function toYesNo(value) {
  const normalized = String(value || "").toLowerCase();
  return normalized.startsWith("s") || normalized.startsWith("y") ? "yes" : "no";
}

function writeContext(data) {
  const now = new Date().toISOString();
  const output = [
    "# Project Context",
    "",
    `- generated_at: ${now}`,
    `- project_name: ${data.projectName}`,
    `- project_goal: ${data.projectGoal}`,
    `- stack_mode: ${data.stackMode}`,
    `- app_type: ${data.appType}`,
    `- project_type: ${data.projectType || "fullstack"}`,
    `- backend_preset: ${data.backendPreset || "rapid"}`,
    `- backend_stack_override: ${data.backendStackOverride || "none"}`,
    `- frontend_preference: ${data.frontendPreference || "react"}`,
    `- vertical: ${data.vertical || "none"}`,
    `- cloud: ${data.cloud}`,
    `- database: ${data.database}`,
    `- include_ai: ${data.includeAI}`,
    `- include_n8n: ${data.includeN8N}`,
    `- include_mcp: ${data.includeMCP}`,
    `- compliance_target: ${data.compliance}`,
    "",
    "## Notes",
    "",
    "- Edita este archivo cuando cambie el alcance.",
    "- Este contexto es la base para decisiones de Codex.",
    "- Usa español con ortografía correcta en documentación.",
    "- Mantén identificadores técnicos en inglés.",
    "",
  ].join("\n");

  const preferredTarget = path.join(process.cwd(), ".codex", "project-context.md");
  try {
    fs.mkdirSync(path.dirname(preferredTarget), { recursive: true });
    fs.writeFileSync(preferredTarget, output, "utf8");
    console.log(`\n[ok] Archivo generado: ${preferredTarget}`);
    return;
  } catch (error) {
    const fallbackTarget = path.join(process.cwd(), "project-context.md");
    fs.writeFileSync(fallbackTarget, output, "utf8");
    console.warn(
      `[warn] No se pudo escribir en .codex (${error.code || "error"}). Se usó fallback: ${fallbackTarget}`
    );
  }
}

async function main() {
  if (process.argv.includes("--defaults")) {
    writeContext({
      projectName: "mi-proyecto",
      projectGoal: "entregar un producto usable en producción",
      stackMode: "fast",
      appType: "fullstack",
      projectType: "fullstack",
      backendPreset: "rapid",
      backendStackOverride: "none",
      frontendPreference: "react",
      vertical: "saas",
      cloud: "aws",
      database: "postgres",
      includeAI: "yes",
      includeN8N: "yes",
      includeMCP: "yes",
      compliance: "basic",
    });
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log("Inicializador de contexto para Codex-Delivery-Kit");
    console.log("Responde en formato corto. Puedes editar después el archivo generado.\n");

    const projectName = await ask(rl, "Nombre del proyecto", "mi-proyecto");
    const projectGoal = await ask(
      rl,
      "Objetivo principal",
      "entregar un producto usable en producción"
    );
    const stackMode = await ask(rl, "Stack mode (scale|fast|custom)", "fast");
    const appType = await ask(rl, "Tipo de app (web|api|mobile|fullstack|ia)", "fullstack");
    const projectType = await ask(
      rl,
      "Project type para scaffold (frontend|backend|fullstack)",
      "fullstack"
    );
    const backendPreset = await ask(rl, "Backend preset (rapid|robust)", "rapid");
    const backendStackOverride = await ask(
      rl,
      "Backend override opcional (none|fastify|nestjs|fastapi|go|java)",
      "none"
    );
    const frontendPreference = await ask(rl, "Frontend preferido (react|angular)", "react");
    const vertical = await ask(
      rl,
      "Vertical (none|saas|ecommerce|marketplace|ai-heavy)",
      "none"
    );
    const cloud = await ask(rl, "Cloud principal (aws|gcp|azure|other)", "aws");
    const database = await ask(rl, "Base de datos principal", "postgres");
    const includeAI = toYesNo(await ask(rl, "Incluye funcionalidades IA? (sí|no)", "sí"));
    const includeN8N = toYesNo(await ask(rl, "Usa n8n? (sí|no)", "sí"));
    const includeMCP = toYesNo(await ask(rl, "Usa MCP? (sí|no)", "sí"));
    const compliance = await ask(
      rl,
      "Compliance objetivo (none|basic|soc2|iso27001|other)",
      "basic"
    );

    writeContext({
      projectName,
      projectGoal,
      stackMode,
      appType,
      projectType,
      backendPreset,
      backendStackOverride,
      frontendPreference,
      vertical,
      cloud,
      database,
      includeAI,
      includeN8N,
      includeMCP,
      compliance,
    });
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`[error] ${error.message}`);
  process.exit(1);
});
