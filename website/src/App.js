import {Route, BrowserRouter, Routes} from "react-router-dom";
import HomeScreen from "./Screens/HomeScreen";
import Socials from "./Screens/Socials";
import PianoScreen from "./Screens/PianoScreen";
import Matthijsle from "./Screens/Matthijsle";
import Games from "./Screens/Games";
import Snake from "./Screens/Snake";
import MineSweeper from "./Screens/MineSweeper";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/piano" element={<PianoScreen />} />
        <Route path="/games" element={<Games />} />
        <Route path="/matthijsle" element={<Matthijsle />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/minesweeper" element={<MineSweeper />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App;