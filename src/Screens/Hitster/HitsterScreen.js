import React from "react";
import "../../style/Hitster/HitsterScreen.css";

const HitsterScreen = (props) => {
    return <div className="hitster_screen_outer">
        <div className="hitster_screen_inner">
            {props.children}
        </div>
    </div>
};

export default HitsterScreen;