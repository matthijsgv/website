import React from 'react';
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
import HomescreenV2 from "./Screens/HomeScreenV2";
import GuitarTuner from "./Screens/GuitarTuner";
import Calculator from "./Screens/Calculator";
import Tools from "./Screens/Tools";
import Chess from "./Screens/Chess";
import ThirtySeconds from "./Screens/ThirtySeconds/ThirtySeconds";
import "./App.css";
import { RoutePath } from "./Constants/RoutePath";
import { useContext } from "react";
import UserContext from "./store/user-context";
import Login from "./Screens/Login";
import Energy from "./Screens/Energy";
import Solitaire from "./Screens/Solitaire";
import Hitster from 'Screens/Hitster/Hitster';

function App() {
  const uctx = useContext(UserContext);

  return (
    <div className="outer" theme={uctx.prefferedTheme}>
      <BrowserRouter>
        <Routes>
          <Route path={RoutePath.ROOT} element={<HomescreenV2 />} />
          <Route path={RoutePath.LOGIN} element={<Login />} />
          <Route path={RoutePath.SOCIALS} element={<Socials />} />
          <Route path={RoutePath.GAMES} element={<Games />} />
          <Route path={RoutePath.MATTHIJSLE} element={<Matthijsle />} />
          <Route path={RoutePath.SNAKE} element={<Snake />} />
          <Route path={RoutePath.MINESWEEPER} element={<MineSweeper />} />
          <Route path={RoutePath.MUSIC_QUIZ} element={<MusicQuiz />} />
          <Route path={RoutePath.TETRIS} element={<Tetris />} />
          <Route path={RoutePath.TFE} element={<TwoThousandFortyEight />} />
          <Route path={RoutePath.TOOLS} element={<Tools />} />
          <Route path={RoutePath.PIANO} element={<PianoScreen />} />
          <Route path={RoutePath.GUITAR_TUNER} element={<GuitarTuner />} />
          <Route path={RoutePath.CALCULATOR} element={<Calculator />} />
          <Route path={RoutePath.CHESS} element={<Chess />} />
          <Route path={RoutePath.THIRTY_SECONDS} element={<ThirtySeconds />} />
          <Route path={RoutePath.SOLITAIRE} element={<Solitaire />} />
          <Route path={RoutePath.HITSTER} element={<Hitster />} />

          <Route path="/energy" element={<Energy />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
