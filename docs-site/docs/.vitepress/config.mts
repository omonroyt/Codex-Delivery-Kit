import { defineConfig } from "vitepress";

const docsBase = process.env.DOCS_BASE || "/";

export default defineConfig({
  base: docsBase,
  title: "Codex-Delivery-Kit",
  description: "Kit profesional para desarrollo con Codex de extremo a extremo",
  lang: "es-ES",
  themeConfig: {
    nav: [
      { text: "Inicio", link: "/" },
      { text: "Quickstart", link: "/quickstart" },
      { text: "Stacks", link: "/stacks" },
      { text: "Workflows", link: "/workflows/commands" },
      { text: "Skills", link: "/skills/overview" },
      { text: "Referencia", link: "/reference/codex-native" }
    ],
    sidebar: [
      {
        text: "Guia",
        items: [
          { text: "Inicio", link: "/" },
          { text: "Quickstart", link: "/quickstart" },
          { text: "Stacks", link: "/stacks" }
        ]
      },
      {
        text: "Workflows",
        items: [{ text: "Comandos Slash", link: "/workflows/commands" }]
      },
      {
        text: "Skills",
        items: [{ text: "Mapa de Skills", link: "/skills/overview" }]
      },
      {
        text: "Referencia",
        items: [
          { text: "Codex Native", link: "/reference/codex-native" },
          { text: "Analisis Antigravity", link: "/reference/antigravity-analysis" },
          { text: "Roadmap V1", link: "/reference/roadmap-v1" }
        ]
      }
    ],
    search: {
      provider: "local"
    }
  }
});
