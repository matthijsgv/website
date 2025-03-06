import React from 'react';
import { useNavigate } from "react-router-dom";
import "../../style/GamesWidgets.css";

const GamesWidget = (props) => {
    const navigate = useNavigate();


    return <div className="games-widget-outer">
    <div
      className="games-widget"
      onClick={() => navigate(props.navigateTo)}
    >
      {props.children}
    </div>
  </div>
};

export default GamesWidget;