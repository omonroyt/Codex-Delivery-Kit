import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Docs from "./pages/Docs";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white shadow">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <Link to="/" className="text-2xl font-bold">
              Codex-Delivery-Kit
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-slate-700 hover:text-slate-900">
                Inicio
              </Link>
              <Link to="/docs" className="text-slate-700 hover:text-slate-900">
                Documentación
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<Docs />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-4 text-center text-sm text-slate-600">
          © 2026 Codex-Delivery-Kit demo
        </footer>
      </div>
    </BrowserRouter>
  );
}
