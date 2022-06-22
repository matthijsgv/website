import {Route, BrowserRouter, Routes} from "react-router-dom";
import HomeScreen from "./Screens/HomeScreen";
import Socials from "./Screens/Socials";
import PianoScreen from "./Screens/PianoScreen";

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/socials" element={<Socials />} />
        <Route path="/piano" element={<PianoScreen />} />
      </Routes>
      </BrowserRouter>
  )
}

export default App;