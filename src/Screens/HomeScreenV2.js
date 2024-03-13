import "../style/HomeScreenV2.css";
import qr from "../images/output-onlinejpgtools.png";
import signature from "../images/signature.png";
import {
  MdEmail,
  MdWork,
  MdPhone,
  MdVideogameAsset,

  MdBuild,
} from "react-icons/md";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,

} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../Constants/RoutePath";

const HomeScreenV2 = () => {
  const navigate = useNavigate();
  return (
    <div className="home_screen_outer">
      <div className="home_screen_abs">
        <div className="buttons-helper">
          <div
            className="home_screen_button games"
            onClick={() => {
              navigate(RoutePath.GAMES);
            }}
          >
            <MdVideogameAsset className="home_screen_icon" />
            Games
          </div>
          <div
            className="home_screen_button tools"
            onClick={() => {
              navigate(RoutePath.TOOLS);
            }}
          >
            <MdBuild className="home_screen_icon" />
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
            <div className="home_screen_name">Matthias Vaessen</div>
            <div className="home_screen_jobtitle">Fullstack Developer</div>

            <div className="home_screen_jobtitle small">
              Java Consultant @ DPA Profressionals
            </div>
          </div>
          <div className="home_screen_contacts">
            <a className="home_screen_contact" href="mailto:matthijs@fam-vaessen.eu">
              <MdEmail className="home_screen_icon" />
              matthijs@fam-vaessen.eu
            </a>
            <a  className="home_screen_contact"  href="mailto:matthijs.vaessen@dpa.nl">
              <MdWork className="home_screen_icon" />
              matthijs.vaessen@dpa.nl
            </a>
            <a className="home_screen_contact" href="tel:+31642863933">
              <MdPhone className="home_screen_icon" />
              +31 6 42863933
            </a>
          </div>
        </div>
        <div className="card_spinner"></div>
      </div>
    </div>
  );
};

export default HomeScreenV2;
