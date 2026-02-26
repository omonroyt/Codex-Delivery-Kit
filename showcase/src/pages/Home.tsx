import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-20 text-center overflow-hidden">
      {/* animated background blobs */}
      <motion.div
        className="absolute -top-16 -left-16 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute -bottom-16 -right-16 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />

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