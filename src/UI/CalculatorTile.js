import React from 'react';
import { useState } from "react";
import { TbDivide, TbMinus, TbX, TbPlus, TbEqual } from "react-icons/tb";

import "../style/UI/CalculatorTile.css";

const CalculatorTile = () => {
  const RainingOperator = (props) => {
    const generateRandomSpecs = () => {
      return {
        x: (Math.random()).toFixed(2),
        delay: Math.floor(Math.random() * 3000),
        size: (Math.random() * 1 + 0.5).toFixed(1),
        speed: Math.floor(Math.random() * 3000 + 2000),
        oper: Math.floor(Math.random() * 5),
      };
    };
    const [randomSpecs, setRandomSpecs] = useState(generateRandomSpecs());

    const operators = [
      <TbDivide />,
      <TbMinus />,
      <TbX />,
      <TbPlus />,
      <TbEqual />,
    ];

    return (
      <div
        id={`raining_operator_${props.id}`}
        className="raining_operator"
        style={{
          "--starting-x": randomSpecs.x,
          "--delay": randomSpecs.delay.toString() + "ms",
          "--size": randomSpecs.size,
          "--speed": randomSpecs.speed.toString() + "ms",
        }}
        onAnimationEnd={(e) => {
          let div = e.target;
          let animation = div.style.animation;
          div.style.animation = "none";
          setRandomSpecs(generateRandomSpecs());
          setTimeout(() => {
            div.style.animation = animation;
          }, 10);
        }}
      >
        {operators[randomSpecs.oper]}
      </div>
    );
  };

  return (
    <div className="rain-container">
      {[...Array(250).keys()].map((x) => (
        <RainingOperator key={x} id={x} />
      ))}
    </div>
  );
};

export default CalculatorTile;
