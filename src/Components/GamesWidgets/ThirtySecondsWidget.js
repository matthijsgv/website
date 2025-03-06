
import { RoutePath } from "Constants/RoutePath";
import GamesWidget from "./GamesWidget";
import React from "react";
import "../../style/Components/GamesWidgets/ThirtySecondsWidget.css";
const ThirtySecondsWidget = () => {
    return <GamesWidget navigateTo={RoutePath.THIRTY_SECONDS}>
        <div className="widget_outer">
            <div className="widget_main">
            <div className="widget_secondairy"></div>
            <div className="widget_overlay"><Hourglass/></div>
            <div className="widget_overlay">30 SECONDS</div>
            </div>
        </div>
    </GamesWidget>

}

const Hourglass = () => {
    return <div className="hourglass">
        <div className="top"></div>
        <div className="bottom"></div>
    </div>
}

export default ThirtySecondsWidget;