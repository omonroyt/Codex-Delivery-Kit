# Angular Tailwind CLI Template

Template de inicializacion rapida Angular + Tailwind (sin Bootstrap).

## Requisitos

- Node LTS
- npm

## Pasos

1. Crear proyecto Angular:

```bash
npm create @angular@latest my-angular-app -- --routing --style css --ssr false --skip-git
```

2. Instalar Tailwind:

```bash
cd my-angular-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

3. Configurar `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4. Reemplazar `src/styles.css` con:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Iniciar:

```bash
npm run start
```

## Nota

Este template prioriza arranque rapido con Angular CLI oficial y estilos en Tailwind.

