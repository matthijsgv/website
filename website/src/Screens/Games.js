import "../style/Games.css";

import {useNavigate} from "react-router-dom";
import {MdArrowBack} from "react-icons/md";

const Games = () => {

    const navigate = useNavigate();
  return (
    <div className="games-outer">
      <div className="topbar">
      <div className="back-icon" onClick={() => {navigate("/")}}> 
          <MdArrowBack />
        </div>
        Games
        
      </div>
    <div className="games">
        <div className="games-row">

      <div className="games-widget" onClick={() => {
        navigate("/matthijsle?mode=daily")
      }}>
        <div className="matthijsle-title">
          <div className="matthijsle-title-tile">M</div>
          <div className="matthijsle-title-tile">A</div>
          <div className="matthijsle-title-tile green">T</div>
          <div className="matthijsle-title-tile yellow">T</div>
          <div className="matthijsle-title-tile">H</div>
          <div className="matthijsle-title-tile yellow">I</div>
          <div className="matthijsle-title-tile">J</div>
          <div className="matthijsle-title-tile green">S</div>
          <div className="matthijsle-title-tile green">L</div>
          <div className="matthijsle-title-tile">E</div>
        </div>
        <div className="matthijsle-subtitle">
            Daily mode
        </div>
      </div>
      <div className="games-widget" onClick={() => {
        navigate("/matthijsle?mode=unlimited")
      }}>
        <div className="matthijsle-title">
          <div className="matthijsle-title-tile">M</div>
          <div className="matthijsle-title-tile">A</div>
          <div className="matthijsle-title-tile green">T</div>
          <div className="matthijsle-title-tile yellow">T</div>
          <div className="matthijsle-title-tile">H</div>
          <div className="matthijsle-title-tile yellow">I</div>
          <div className="matthijsle-title-tile">J</div>
          <div className="matthijsle-title-tile green">S</div>
          <div className="matthijsle-title-tile green">L</div>
          <div className="matthijsle-title-tile">E</div>
        </div>
        <div className="matthijsle-subtitle">
            Unlimited mode
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Games;
