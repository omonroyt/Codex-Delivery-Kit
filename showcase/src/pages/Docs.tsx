import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const pageList = [
  "index",
  "quickstart",
  "stacks",
  "workflows/commands",
  "skills/overview",
  "reference/codex-native",
  "reference/antigravity-analysis",
  "reference/roadmap-v1",
];

export default function Docs() {
  const { "*": path } = useParams();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const file = path ? path : "index";
    fetch(`/docs/${file}.md`)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("# No se encontró el documento"));
  }, [path]);

  return (
    <div className="flex">
      <aside className="w-64 bg-white p-4 shadow-md">
        <nav className="space-y-2">
          {pageList.map((p) => (
            <Link
              key={p}
              to={`/docs/${p}`}
              className="block text-slate-700 hover:text-slate-900"
            >
              {p.replace(/\//g, " > ")}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="prose prose-slate max-w-none p-6">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </motion.div>
      </article>
    </div>
  );
}