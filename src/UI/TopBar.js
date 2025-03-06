import React from 'react';
import "../style/UI/TopBar.css";

const TopBar = (props) => {

    const TopBarIcon = (props) => {

        return <div
        className="top-bar-icon"
        onClick={props.onClick}
      >
        {<props.Icon className="top-bar-icon-visual"/>}
      </div>
    }
    return <div id="topbar" className={props.small ? "topbar-small-text" : "topbar"}>
        {props.leftIcon ? <TopBarIcon onClick={props.leftIcon.onClick} Icon={props.leftIcon.Icon}  /> : <div className="top-bar-icon"></div>}
        {props.title.toUpperCase()}
        {props.children}
        {props.rightIcon ? <TopBarIcon onClick={props.rightIcon.onClick} Icon={props.rightIcon.Icon}  /> : <div className="top-bar-icon"></div>}
    </div>
};

export default TopBar;