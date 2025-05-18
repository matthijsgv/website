import React from "react";
import "../style/Components/LoadingIndicator.css";
import { useScreenWidth } from "util/useScreenWidth";

const LoadingIndicator = (props) => {
    const screenwidth = useScreenWidth();
    const active = screenwidth > 600 ? props.style : props.mobileStyle;
    const style = {
        height: active.size,
        width: active.size,
        borderWidth: active.thickness,
    }

    if (props.colors) {
        style["borderColor"] = props.colors.secondaryColor;
        style["borderTopColor"] = props.colors.mainColor;
    }

    return <div className="loading-indicator" style={style}></div>
};

export default LoadingIndicator;