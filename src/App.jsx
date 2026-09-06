import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LanguageProvider } from "./context/LanguageContext";
import { Home, About, Projects, Contact } from "./pages";
import islandBg from "./assets/images/island-bg.png";

const App = () => {
  return (
    <LanguageProvider>
      <main
        style={{ backgroundImage: `url(${islandBg})` }}
        className="min-h-[100dvh] bg-cover bg-center bg-no-repeat bg-island-black font-sans text-cream"
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
        <SpeedInsights />
      </main>
    </LanguageProvider>
  );
};

export default App;
