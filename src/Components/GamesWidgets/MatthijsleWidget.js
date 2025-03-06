import React from 'react';
import { RoutePath } from "../../Constants/RoutePath";
import GamesWidget from "./GamesWidget";

const MatthijsleWidget = (props) => {

    return <GamesWidget navigateTo={RoutePath.MATTHIJSLE + "?mode=" + props.mode}>
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
            <div className="matthijsle-subtitle">Daily mode</div>
    </GamesWidget>
};

export default MatthijsleWidget;