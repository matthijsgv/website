import "../style/HomeScreenV2.css";
import qr from "../images/output-onlinejpgtools.png";
import signature from "../images/signature.png";
import {
  MdEmail,
  MdWork,
  MdPhone,
  MdMenu,
} from "react-icons/md";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,

} from "react-icons/fa";

import { PiToolbox, PiGameController} from "react-icons/pi";
import { SideBar } from "../Components/SideBar";

import { useNavigate } from "react-router-dom";
import { RoutePath } from "../Constants/RoutePath";
import TopBar from "../UI/TopBar";
import React, { useContext, useState } from "react";
import UserContext from "../store/user-context";



const HomeScreenV2 = React.memo(() => {
  const [initialLoad, setInitialLoad] = useState(true);

  const uctx = useContext(UserContext);


  
  const navigate = useNavigate();

  const [showSidebar, setShowSideBar] = useState(false);

  return (
    <div>
      <TopBar 
      small={true}
      leftIcon={
        {
          onClick: () => {
            setInitialLoad(false); 
            setShowSideBar(state => !state);
          },
          Icon: MdMenu  
        }
      } title="Matthijs' QR-Code Tattoo" />
      <SideBar role={uctx.role} initialLoad={initialLoad} showSidebar={showSidebar} />
      <div className="home_screen_outer">
        <div className="home_screen_abs">
          <div className="buttons-helper">
            <div
              className="home_screen_button games"
              onClick={() => {
                navigate(RoutePath.GAMES);
              }}
            >
              <PiGameController className="home_screen_icon" />
              Games
            </div>
            <div
              className="home_screen_button tools"
              onClick={() => {
                navigate(RoutePath.TOOLS);
              }}
            >
              <PiToolbox className="home_screen_icon" />
              Tools
            </div>
            <div className="home_screen_socials">
              <div className="home_screen_socials_button whatsapp" onClick={() => {
                window.open("https://wa.me/+31642863933");
              }}>
                <FaWhatsapp />
              </div>
              <div className="home_screen_socials_button facebook" onClick={() => {
                window.open("https://www.facebook.com/matthijs.vaessen");
              }}>
                <FaFacebook color="white" />
              </div>
              <div className="home_screen_socials_button insta" onClick={() => {
                window.open("https://www.instagram.com/matthijsgv/");
              }}>
                <FaInstagram />
              </div>
              <div className="home_screen_socials_button linkedin" onClick={() => {
                window.open("https://www.linkedin.com/in/matthias-vaessen-b60839162/");
              }}>
                <FaLinkedin />
              </div>
            </div>
          </div>
          <div className="home_screen_qr_code_outer">
            <div className="home_screen_qr_code-foreground"></div>
            <img className="home_screen_qr_pic" src={qr} alt="qr" />
            Welcome
          </div>
        </div>
        <div className=""></div>
        <div className="home_screen_card_outer">
          <div className="home_screen_card_inner">
            <img
              className="home_screen_signature"
              src={signature}
              alt="signature"
            />
            <div className="home_screen_titles">
              <div className="home_screen_name">Matthijs Vaessen</div>

              <div className="home_screen_jobtitle small">
                Java Backend Developer @ Schiphol
              </div>
            </div>
            <div className="home_screen_contacts">
              <a className="home_screen_contact" href="mailto:matthijs@fam-vaessen.eu">
                <MdEmail className="home_screen_icon" />
                matthijs@fam-vaessen.eu
              </a>
              <a className="home_screen_contact" href="tel:+31642863933">
                <MdPhone className="home_screen_icon" />
                +31 6 42863933
              </a>
              <a className="home_screen_contact" href="mailto:matthias.vaessen@schiphol.nl">
                <MdWork className="home_screen_icon" />
                matthias.vaessen@schiphol.nl
              </a>
              <a className="home_screen_contact" href="tel:+31642863933">
                <MdPhone className="home_screen_icon" />
                +31 6 48416803
              </a>
            </div>
          </div>
          <div className="card_spinner"></div>
        </div>
      </div>
    </div>
  );
});

export default HomeScreenV2;