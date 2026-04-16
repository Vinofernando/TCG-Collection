import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StarterDeck from "./pages/StarterDeck";
import BoosterPack from "./pages/BoosterPack";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Path "/" akan menampilkan komponen Home */}
        <Route path="/" element={<Home />} />
        <Route path="/starter-deck" element={<StarterDeck />} />
        <Route path="/booster-pack" element={<BoosterPack />} />
      </Routes>
    </BrowserRouter>
  );
}
