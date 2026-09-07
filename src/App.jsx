import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LanguageProvider } from "./context/LanguageContext";
import { Home } from "./pages";
import islandBg from "./assets/images/island-bg.png";

const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

const AppLayout = () => {
  const location = useLocation();
  const isSubpage = location.pathname !== "/";

  return (
    <main
      style={{ backgroundImage: `url(${islandBg})` }}
      className="min-h-[100dvh] bg-cover bg-center bg-no-repeat bg-island-black font-sans text-cream relative overflow-x-clip"
    >
      {/* Persistent 3D World: Never destroyed across page navigation */}
      <div
        aria-hidden={isSubpage}
        className={`fixed inset-0 w-full h-full z-0 transition-opacity duration-700 pointer-events-auto ${
          isSubpage ? "pointer-events-none select-none" : ""
        }`}
      >
        <Home />
      </div>

      {/* Subpage Overlay Pages: unroll downwards over the persistent island background */}
      {isSubpage && (
        <div className="relative z-10 w-full min-h-[100dvh]">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </div>
      )}

      <SpeedInsights />
    </main>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <AppLayout />
      </Router>
    </LanguageProvider>
  );
};

export default App;
