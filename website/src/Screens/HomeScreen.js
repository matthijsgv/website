import "../style/HomeScreen.css";
import {
  MdEmail,
  MdWork,
  MdPhone,
  MdPiano,
  MdOutlinePhoneIphone,
  MdVideogameAsset,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qr from "../images/output-onlinejpgtools.png";

const HomeScreen = () => {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 2000);
  }, []);

  return (
    <div>
      <div className="homescreen-outer">
        <div className="centered">
          <img className="qr-dims" src={qr} alt="qr-code"></img>
          <div>Welcome!</div>
        </div>
        <div className="homescreen-inner">
          <div className="business-card-helper">
            {showButtons && (
              <div
                className="socials-button"
                onClick={() => {
                  navigate("/socials");
                }}
              >
                <MdOutlinePhoneIphone /> Socials
              </div>
            )}
            {showButtons && (
              <div
                className="piano-button"
                onClick={() => {
                  navigate("/piano");
                }}
              >
                <MdPiano /> Play Piano
              </div>
            )}
            {showButtons && (
              <div
                className="games-button"
                onClick={() => {
                  navigate("/games");
                }}
              >
                <MdVideogameAsset /> Games
              </div>
            )}
            <div className="business-card-outer">
              <div className="business-card">
                <div className="business-card-inner">
                  <div>
                    <div className="title">Matthias Vaessen</div>
                    <div className="subtitle">Fullstack Developer</div>
                  </div>
                  <div className="additional-info">
                    <div className="item">
                      <MdEmail className="card-icon" />
                      matthijs@fam-vaessen.eu
                    </div>
                    <div className="item">
                      <MdWork className="card-icon" />
                      matthias.vaessen@tcs.com
                    </div>
                    <div className="item">
                      <MdPhone className="card-icon" />
                      +31 6 42863933
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
