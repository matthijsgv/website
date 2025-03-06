import React from 'react';
import "../../style/ThirtySeconds/KiesKaartjeButton.css";

const KiesKaartjeButton = (props) => {
  return (
    <div className="kies-kaartje-button-outer" onClick={props.onClick}>
      <div
        className={
          "kies-kaartje-button-kaartje" +
          (props.color === "yellow" ? " yellow" : " blue")
        }
        onClick={props.onClick}
      >
        <div
          className={
            "kies-kaartje-button-kaartje-inner" +
            (props.color === "yellow" ? " yellow" : " blue")
          }
          onClick={props.onClick}
        ></div>
      </div>
      UIT
    </div>
  );
};

export default KiesKaartjeButton;
