import { Route, BrowserRouter, Routes } from "react-router-dom";
import Socials from "./Screens/Socials";
import PianoScreen from "./Screens/PianoScreen";
import Matthijsle from "./Screens/Matthijsle";
import Games from "./Screens/Games";
import Snake from "./Screens/Snake";
import MineSweeper from "./Screens/MineSweeper";
import MusicQuiz from "./Screens/MusicQuiz";
import Tetris from "./Screens/Tetris";
import TwoThousandFortyEight from "./Screens/TwoThousandFortyEight";
import Test from "./Screens/Test";
import HomescreenV2 from "./Screens/HomeScreenV2";
import GuitarTuner from "./Screens/GuitarTuner";
import Calculator from "./Screens/Calculator";
import Tools from "./Screens/Tools";
import Chess from "./Screens/Chess";
import ThirtySeconds from "./Screens/ThirtySeconds/ThirtySeconds";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomescreenV2 />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/piano" element={<PianoScreen />} />
        <Route path="/games" element={<Games />} />
        <Route path="/matthijsle" element={<Matthijsle />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/minesweeper" element={<MineSweeper />} />
        <Route path="/music_quiz" element={<MusicQuiz />} />
        <Route path="/tetris" element={<Tetris />} />
        <Route path="/2048" element={<TwoThousandFortyEight />} />
        <Route path="/test" element={<Test />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/guitar_tuner" element={<GuitarTuner />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/chess" element={<Chess />} />
        <Route path="/30_seconds" element={<ThirtySeconds />} />
        <Route path="/energie" element={<ThirtySeconds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
