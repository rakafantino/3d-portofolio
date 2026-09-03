import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import { Home, About, Projects, Contact } from "./pages";

const App = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-island-black font-sans text-cream">
      <Router>
        <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onOpen={() => setPaletteOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
      <SpeedInsights />
    </main>
  );
};

export default App;