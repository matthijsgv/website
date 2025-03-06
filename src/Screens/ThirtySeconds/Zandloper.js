import React from 'react';
import "../../style/ThirtySeconds/Zandloper.css";
import { useState } from "react";
import airhornSound from "../../assets/airhorn.mp3";
const Zandloper = () => {
  const [animationRunning, setAnimationRunning] = useState(false);
  const [timeouts, setTimeouts] = useState([]);
  const playAirhorn = () => {
    const airhorn = document.getElementById("airhorn");
    airhorn.play();
  };

  const onReset = () => {
    console.log(timeouts);
    setAnimationRunning(false);
    timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    setTimeouts([]);
  };

  const startZandloper = () => {
    setAnimationRunning(true);
    const airhornTimer = setTimeout(() => {
      playAirhorn();
    }, 30000);

    const animationTimer = setTimeout(() => {
      setAnimationRunning(false);
    }, 31000);
    setTimeouts([airhornTimer, animationTimer]);
  };

  return (
    <div>
      <audio id="airhorn" src={airhornSound} />
      <div
        className="zandloper-outer"
        onClick={() => {
          if (animationRunning) {
            onReset();
          } else {
            startZandloper();
          }
        }}
      >
        <div className="zandloper-frame top"></div>
        <div className="zandloper-frame bottom"></div>
        <div className="zandloper-top">
          <div
            id="top-zand"
            className={
              "zandloper-top-zand" + (animationRunning ? "" : " no-animation")
            }
          >
            <div className="sand-blur"></div>
          </div>
        </div>
        <div className="zandloper-bottom">
          <div
            className={
              "zandloper-lopend-zand" +
              (animationRunning ? "" : " no-animation")
            }
          >
            <div className="sand-blur"></div>
          </div>
          <div
            className={
              "zandloper-bottom-zand" +
              (animationRunning ? "" : " no-animation")
            }
          >
            <div className="sand-blur"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zandloper;
