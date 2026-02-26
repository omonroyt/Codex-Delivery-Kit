import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <motion.p
        className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Bienvenido a la demo
      </motion.p>
      <motion.h1
        className="mt-4 text-4xl font-bold tracking-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Plataforma demo de Codex-Delivery-Kit
      </motion.h1>
      <motion.p
        className="mt-4 text-base text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Esta aplicación usa React, Tailwind y Vite para mostrar cómo funciona el
        proyecto principal. Aquí encontrarás la documentación completa y un
        recorrido animado.
      </motion.p>
    </section>
  );
}