import "../style/UI/GuitarTunerIcon.css";

import React from "react";

const GuitarTunerIcon = (props) => {
  //   let p = document.getElementById("plectrum");
  //   p.style.setProperty("--fork-size", props.size);

  return (
    <div className="plectrum">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
        width={props.size}
        height={props.size}
      >
        <g
          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
          fill={props.backgroundColor}
          stroke="none"
        >
          <path d="M2225 5105 c-487 -42 -900 -172 -1215 -383 -471 -315 -678 -811 -581 -1392 125 -744 612 -1847 1134 -2569 165 -227 298 -377 448 -505 129 -110 239 -178 356 -219 77 -27 101 -31 193 -31 92 0 116 4 193 31 302 106 632 437 981 985 461 723 848 1658 957 2308 97 581 -110 1077 -581 1392 -454 304 -1150 446 -1885 383z" />
        </g>
      </svg>
      <div
        style={{
          "--fork-size": props.size,
          "--fork-color": props.forkColor ? props.forkColor : "black",
        }}
        className="tuner-fork"
      >
        <div className="fork-bottom"></div>
        <div className="fork-top"></div>
      </div>
    </div>
  );
};

export default GuitarTunerIcon;
