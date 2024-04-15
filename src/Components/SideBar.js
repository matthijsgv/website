
import { useEffect, useContext } from "react";
import { PiToolbox, PiGameController, PiHeart, PiUserCircleFill, PiMoonStars, PiSun, PiSignOut } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/user-context";
import { RoutePath } from "../Constants/RoutePath";
import "../style/Components/SideBar.css";
const Switch = (props) => {

  const uctx = useContext(UserContext);

  useEffect(() => {
    console.log("reloaded")
  }, [])

  const onSwitch = () => {
    console.log("switch me dadyy")
    if (uctx.prefferedTheme === "dark") {
      uctx.changeTheme("light");
    } else {
      uctx.changeTheme("dark");
    }
  };

  return <div className="switch-outer" onClick={() => {
    onSwitch();
  }}>
    <div className="switch-track">
      <div className={uctx.prefferedTheme === "dark" ? "switch-thumb right" : "switch-thumb left"} >
        {uctx.prefferedTheme === "dark" ? <PiMoonStars className="side_bar_icon" /> : <PiSun className="side_bar_icon" />}
      </div>
    </div>

  </div>
};

export const SideBar = (props) => {

  const uctx = useContext(UserContext);

  const SideBarOption = (props) => {
    const navigate = useNavigate();

    return <div className="home_side_bar_option" onClick={() => {
      if (props.onClick) {
        props.onClick()
      }
      if (props.path) {
        navigate(props.path)
      }
    }}>
      <div className="home_side_bar_option_icon">{props.icon}</div>
      <div>{props.label}</div>
    </div>
  };

  return <div id="sidebar" logged-in={uctx.loggedIn.toString()} className={props.showSidebar ? "home_side_bar open" : (props.initialLoad ? "home_side_bar" : "home_side_bar close")}>

    <div>
      {uctx.loggedIn ? <div className="home_side_bar_option">
        <div className="home_side_bar_user_icon">
          <PiUserCircleFill />
        </div>
        <div className="home_side_bar_user_info">
          <div className="home_side_bar_user_name">{uctx.name}</div>
          <div className="home_side_bar_user_role">{uctx.role.split("_")[1]}</div>
        </div>
      </div> : <SideBarOption path={RoutePath.LOGIN} icon={<PiUserCircleFill className="side_bar_icon" />} label="Login" />}
      <SideBarOption path={RoutePath.GAMES} icon={<PiGameController className="side_bar_icon" />} label="Games" />
      <SideBarOption path={RoutePath.TOOLS} icon={<PiToolbox className="side_bar_icon" />} label="Tools" />
      {["ROLE_GIRLFRIEND", "ROLE_ADMIN"].includes(props.role) && <SideBarOption path={RoutePath.XANA} icon={<PiHeart className="side_bar_icon" />} label="Xana" />}
    </div>
    <div>
      {uctx.loggedIn && <SideBarOption icon={<PiSignOut />} label="Logout" onClick={() => {
        uctx.logout();
      }} />}
      <div className="switch_title">Choose your theme</div>
      <div className="home_side_bar_theme_switch">
        <div className="switch_label">light</div>
        <Switch theme={props.theme} />
        <div className="switch_label">dark</div>
      </div>
    </div>
  </div>;
};