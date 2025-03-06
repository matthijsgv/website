import React from 'react';
import { RoutePath } from "../../Constants/RoutePath";
import { FaBomb } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import GamesWidget from "./GamesWidget";
import "../../style/GamesWidgets.css";

const MatthijsSweeperWidget = () => {

    let initialTiles = [...Array(242).fill("")];

  const fillTilesWithValue = (list, value) => {
    for (let i of list) {
      initialTiles[i] = value;
    }
  };

  fillTilesWithValue(
    [
      0, 1, 2, 3, 4, 5, 14, 16, 18, 19, 21, 37, 48, 60, 44, 28, 29, 53, 56, 59,
      68, 69, 99, 100, 103, 116, 119,
    ],
    "1"
  );
  fillTilesWithValue([17, 20, 49, 50, 52, 113, 97, 81, 115], "flag");
  fillTilesWithValue(
    [30, 32, 36, 37, 51, 57, 58, 64, 67, 80, 82, 72, 88, 104, 112],
    "2"
  );
  fillTilesWithValue([33, 34, 35, 66, 96, 65, 114], "3");
  fillTilesWithValue(
    [
      6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 25, 26, 27, 38, 39, 40, 41, 42,
      43, 54, 55, 70, 71, 83, 84, 85, 86, 87, 101, 102, 117, 118,
    ],
    " "
  );
  fillTilesWithValue([98], "4");

  return (
    <GamesWidget navigateTo={RoutePath.MINESWEEPER}>
      <div className="matthijs-sweeper-tile">
        <div className="matthijs-sweeper-title">
          Matthijs <br /> Sweeper
        </div>
        <div className="matthijs-sweeper-widget-background">
          <div className="matthijs-sweeper-widget-background-tiles">
            {initialTiles.map((x, idx) => {
              return (
                <div key={Math.random().toString()} className="tile" value={x}>
                  {x === "bomb" ? <FaBomb /> : x === "flag" ? <MdFlag /> : x}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GamesWidget>
  );
};

export default MatthijsSweeperWidget;
