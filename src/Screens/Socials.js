import React from 'react';
import "../style/Socials.css";

import pic from "../images/foto.jpg";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaGithub,
  FaSpotify,
  FaPaypal,
} from "react-icons/fa";

import { MdEmail, MdPhone, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../Constants/RoutePath";

const Socials = () => {
  const navigate = useNavigate();
  return (
    <div className="socials-outer">
      <div className="topbar-socials">
        <div
          className="back-icon-socials"
          onClick={() => {
            navigate(RoutePath.ROOT);
          }}
        >
          <MdArrowBack />
        </div>
        Matthijsagram
      </div>
      <div className="socials-inner">
        <div className="socials-inner-inner">
          <div className="socials-top-row">
            <div className="socials-profile-picture">
              <img src={pic} alt="profile-pic"></img>
              <div className="name">Matthias Vaessen</div>
            </div>
            <div className="socials-stats">
              <div className="item">
                <div className="number">17</div>
                <div className="label">Day</div>
              </div>
              <div className="item">
                <div className="number">09</div>
                <div className="label">Month</div>
              </div>
              <div className="item">
                <div className="number">1997</div>
                <div className="label">Year</div>
              </div>
            </div>
          </div>
          <div className="socials-bio">
            Fullstack Developer: {"\n"}
            <div className="indent">
              - React (Native) {"\n"}- Java {"\n"}- Kotlin {"\n"}
            </div>
            @ Tata Consultancy Services (TCS)
          </div>
          <div className="socials-playlists">
            <div className="header">Playlists</div>
            <div className="playlists">
              <div
                className="item-outer"
                onClick={() => {
                  window.open(
                    "https://open.spotify.com/playlist/2JjsUmf4HpcIMMSvos1wa3?si=shsTUi1nRPqML4cH3sa74Q&utm_source=copy-link"
                  );
                }}
              >
                <div className="logo">
                  <FaSpotify />
                </div>
                <div className="label">Main playlist</div>
              </div>
              <div
                className="item-outer"
                onClick={() => {
                  window.open(
                    "https://open.spotify.com/playlist/5kJjbAs10LXxWP0zoGv65H?si=tNWvz1Z7RwK8N4mmmMNGPg&utm_source=copy-link"
                  );
                }}
              >
                <div className="logo">
                  <FaSpotify />
                </div>
                <div className="label">Rap</div>
              </div>
              <div
                className="item-outer"
                onClick={() => {
                  window.open(
                    "https://open.spotify.com/playlist/37i9dQZF1EUMDoJuT8yJsl?si=hWBsdCVoTdOWRQz2r7MeOA&utm_source=copy-link"
                  );
                }}
              >
                <div className="logo">
                  <FaSpotify />
                </div>
                <div className="label">Top 100</div>
              </div>
            </div>
          </div>
          <div className="socials-grid">
            <div
              data="facebook"
              className="item"
              onClick={() => {
                window.open("https://www.facebook.com/matthijs.vaessen");
              }}
            >
              <FaFacebook color="white" />
            </div>
            <div data="instagram" className="item">
              <FaInstagram
                color="white"
                onClick={() => {
                  window.open("https://www.instagram.com/matthijsgv/");
                }}
              />
            </div>
            <div
              data="whatsapp"
              className="item"
              onClick={() => {
                window.open("https://wa.me/+31642863933");
              }}
            >
              <FaWhatsapp color="white" />
            </div>
            <a
              data="email"
              className="item"
              href="mailto:matthijs@fam-vaessen.eu"
            >
              <MdEmail color="white" />
            </a>
            <div
              data="linkedin"
              className="item"
              onClick={() => {
                window.open(
                  "https://www.linkedin.com/in/matthias-vaessen-b60839162/"
                );
              }}
            >
              <FaLinkedin color="white" />
            </div>
            <a data="phone" className="item" href="tel:+31642863933">
              <MdPhone color="white" />
            </a>
            <div
              data="spotify"
              className="item"
              onClick={() => {
                window.open(
                  "https://open.spotify.com/user/t9yosouipe721gkkl4v76tge8?si=hN7ZIO05TS6YApUiKCQ3BA&utm_source=copy-link"
                );
              }}
            >
              <FaSpotify color="white" />
            </div>
            <div
              data="github"
              className="item"
              onClick={() => {
                window.open("https://github.com/matthijsgv/");
              }}
            >
              <FaGithub color="white" />
            </div>
            <div
              data="paypal"
              className="item"
              onClick={() => {
                window.open("https://www.paypal.com/paypalme/matthijsvaessen");
              }}
            >
              <FaPaypal color="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Socials;
