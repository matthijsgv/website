import React from 'react';
import "../../style/ThirtySeconds/ThirtySeconds.css";

import Kaartje from "./Kaartje";
import Zandloper from "./Zandloper";
import { useState } from "react";
import KiesKaartjeButton from "./KiesKaartjeButton";
const ThirtySeconds = () => {

const importAll = (r) => {
  console.log(r.keys());
  let categories = {};
  r.keys().forEach((key) => {
    const categoryName = key.replace('./', '').replace('.js', '');
    console.log("categoryName", categoryName);
    categories[categoryName] = r(key)[categoryName];
  });
  return categories;
};

// @ts-ignore
const woorden = importAll(require.context('./categorien', false, /\.js$/));
console.log(woorden);
  const [gespeeldeWoorden, setGespeeldeWoorden] = useState([]);
  const [curWoorden, setCurWoorden] = useState([]);
  const [curColor, setCurColor] = useState("");
  const pickRandomFromList = (list) => {
    const possibleList = list.filter(
      (word) => !gespeeldeWoorden.includes(word)
    );
    if (possibleList.length === 0) {
      return null;
    }
    return possibleList[Math.floor(Math.random() * possibleList.length)];
  };

  const kiesVijfWoorden = () => {
    let categorien = [...Object.keys(woorden)];
    console.log(categorien);
    let vijfWoorden = [];
    for (let i = 0; i < 5; i++) {
      let pickedIndex = Math.floor(Math.random() * categorien.length);
      let pickedCategory = categorien.splice(pickedIndex, 1);
      let pickedCategoryList = woorden[pickedCategory];
      let word = pickRandomFromList(pickedCategoryList);
      setGespeeldeWoorden((state) => {
        return [...state, word];
      });
      vijfWoorden.push(word);
    }
    setCurWoorden(vijfWoorden);
  };

  return (
    <div className="thirty-seconds-outer">
      <div className="kies-kaartje-row">
        <KiesKaartjeButton
          color="yellow"
          onClick={() => {
            kiesVijfWoorden();
            setCurColor("yellow");
          }}
        />
        <KiesKaartjeButton
          color="blue"
          onClick={() => {
            kiesVijfWoorden();
            setCurColor("blue");
          }}
        />
      </div>
      <div className="thirty-seconds-zandloper">
        <Zandloper />
      </div>
      <div className="kaartje-row">
        {curWoorden.length === 5 && (
          <Kaartje woorden={curWoorden} kleur={curColor} />
        )}
      </div>
    </div>
  );
};

export default ThirtySeconds;
