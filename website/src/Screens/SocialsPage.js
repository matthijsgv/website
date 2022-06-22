import logo from "./logo.svg";
import "./App.css";
import { Fragment } from "react/cjs/react.production.min";
import ModalVideo from "react-modal-video";
import React, { useState, useEffect } from "react";

import { SocialIcon } from "react-social-icons";

import { MdEmail, MdWork, MdPhone, MdPiano, MdOutlinePhoneIphone} from "react-icons/md";

import pic from "./images/foto.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaWhatsapp,
  FaGithub,
  FaSpotify,
  FaPaypal,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import "./styling.css";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import "react-piano/dist/styles.css";
import SoundfontProvider from "../SoundfontProvider";
import HomeScreen from "./HomeScreen";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("e4"),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

function ResponsivePiano(props) {
  return (
    <SoundfontProvider
      instrumentName="acoustic_grand_piano"
      audioContext={audioContext}
      hostname={soundfontHostname}
      render={({ isLoading, playNote, stopNote }) => (
        <Piano
          noteRange={noteRange}
          width={props.width}
          playNote={playNote}
          stopNote={stopNote}
          disabled={isLoading}
          {...props}
        />
      )}
    />
  );
}

function App() {
  const { height, width } = useWindowDimensions();
  const [isPhone, setIsPhone] = useState(true);
  const [gridWidth, setGridWith] = useState(null);
  const [sideMargins, setSideMargins] = useState(0);
  const [middleMargins, setMiddleMargins] = useState(2);
  const [spaceForPiano, setSpaceForPiano] = useState(false);
  const [extraSpacePossible, setExtraSpacePossible] = useState(false);
  const [openPiano, setOpenPiano] = useState(false);
  const gridItem = (width - 6) / 3;
  console.log(gridItem);

  
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 2000);
  },[]);

  const calculateGridSize = (width) => {
    console.log("Width", width);
    console.log("Gridsize", width / 3);
    if (width % 3 == 0) {
      console.log();
      setGridWith(width / 3 - 2);
      setSideMargins(1);
    }
    if (width % 3 == 1) {
      setGridWith(Math.floor(width / 3) - 2);
      setSideMargins(1);
    }
    if (width % 3 == 2) {
      setGridWith(Math.floor(width / 3) - 2);
      setSideMargins(2);
    }
  };

  const checkSpace = (height, width) => {
    const grid = Math.floor(width / 3 - 2);
    const spaceNeeded = (width / 10) * 3 + 3;
    console.log("Needed", spaceNeeded);
    const spaceAvailable =
      height - (140 + 40 + 10 + grid * 3 + 4 + 8 + 30 + 20);
    console.log("Available", spaceAvailable);

    if (spaceAvailable >= spaceNeeded) {
      console.log("Possible", "yes");
      setSpaceForPiano(true);
    } else if (spaceAvailable + height * 0.05 >= spaceNeeded) {
      setExtraSpacePossible(true);
    }
  };

  const checkIfPhone = (width) => {
    if (width > 768) {
      console.log("Nee");
      setIsPhone(false);
    }
  };
  useState(() => {
    checkIfPhone(width);
    calculateGridSize(width);
    checkSpace(height, width);
  }, [isPhone]);

  const [temp, setTemp] = useState(false);

  return (
    <Fragment>
      {!temp && (
        <HomeScreen />
      )}
      {temp && (
        <div
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            {!isPhone && (
              <span style={{ fontSize: 100, color: "white" }}>
                This page can only be accessed from a phone.
              </span>
            )}
            {isPhone && (
              <div>
                <div
                  style={{
                    padding: 10,
                    height: 140 + (openPiano ? 0 : 40) + 10,
                  }}
                >
                  {/* <div style={{ marginBottom: 10, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 25, fontWeight: 900, color: "white", }}>MATTHIJS' QR CODE</span>
              </div> */}
                  {/* Top bar met foto, posts, followers, following */}
                  <div
                    style={{
                      height: 140,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          float: "left",
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          backgroundColor: "white",
                          marginLeft: 10,
                        }}
                      >
                        <img
                          style={{ width: 100, height: 100, borderRadius: 60 }}
                          src={pic}
                        ></img>
                      </div>
                      <div
                        style={{
                          float: "left",
                          height: 60,
                          width: width - 100 - 70,
                          padding: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{}}>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "6vw",
                                  fontWeight: 800,
                                  color: "white",
                                  textAlign: "center",
                                }}
                              >
                                17
                              </span>
                            </div>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "4vw",
                                  fontWeight: 200,
                                  color: "white",
                                }}
                              >
                                Day
                              </span>
                            </div>
                          </div>
                          <div style={{ width: 60 }}>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "6vw",
                                  fontWeight: 800,
                                  color: "white",
                                }}
                              >
                                09
                              </span>
                            </div>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "4vw",
                                  fontWeight: 200,
                                  color: "white",
                                }}
                              >
                                Month
                              </span>
                            </div>
                          </div>
                          <div style={{ width: 60 }}>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "6vw",
                                  fontWeight: 800,
                                  color: "white",
                                }}
                              >
                                1997
                              </span>
                            </div>
                            <div
                              style={{
                                width: 60,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "4vw",
                                  fontWeight: 200,
                                  color: "white",
                                }}
                              >
                                Year
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ alignItems: "center", marginTop: 5 }}>
                        <span
                          style={{
                            fontSize: 15,
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Matthijs Vaessen
                        </span>
                      </div>
                    </div>
                  </div>
                  {!openPiano && (
                    <div style={{ width: "100%", height: 40 }}>
                      <div>
                        <span style={{ fontSize: "1.8vh", color: "white" }}>
                          Full Stack Developer - Java, React, Kotlin, Azure{" "}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "1.8vh", color: "white" }}>
                          @ Tata Consultancy Services (TCS){" "}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Piano DIV */}
                <div
                  style={{
                    width: "100%",
                    height:
                      height -
                      (140 +
                        50 +
                        (openPiano ? 0 : 40) +
                        10 +
                        gridWidth * 3 +
                        4 +
                        8 +
                        30 +
                        20),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!spaceForPiano && (
                    <div>
                      {extraSpacePossible && (
                        <div>
                          {!openPiano ? (
                            <div
                              className="button"
                              style={{
                                width: 200,
                                height: 50,
                                zIndex: 10,
                                borderRadius: 20,
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex",
                              }}
                              onClick={() => {
                                setOpenPiano(true);
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 20,
                                  fontWeight: 800,
                                  color: "black",
                                }}
                              >
                                CLICK FOR PIANO
                              </span>
                            </div>
                          ) : (
                            <ResponsivePiano width={width} />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {spaceForPiano && (
                    <div
                      style={{ width: "100%", height: (width / 10) * 3 + 3 }}
                    >
                      <ResponsivePiano width={width} />
                    </div>
                  )}
                </div>
                {/* Foto-grid met socials */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    height: gridWidth * 3 + 4 + 8 + 30,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderBottom: "2px solid white",
                      marginBottom: 2,
                    }}
                  ></div>
                  <div
                    style={{ display: "grid", width: "100%", height: width }}
                  >
                    <div style={{}}>
                      <div
                        className="facebook"

                        onClick={() => {
                          window.open(
                            "https://www.facebook.com/matthijs.vaessen"
                          );
                        }}
                      >
                        <div className="center">
                          <FaFacebook size={80} color="white" />
                        </div>
                      </div>
                      <div
                        className="instagram"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                        onClick={() => {
                          window.open("https://www.instagram.com/matthijsgv/");
                        }}
                      >
                        <div className="center">
                          <FaInstagram size={80} color="white" />
                        </div>
                      </div>
                      <div
                        className="whatsapp"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                        onClick={() => {
                          window.open("https://wa.me/+31642863933");
                        }}
                      >
                        <div className="center">
                          <FaWhatsapp size={80} color="white" />
                        </div>
                      </div>
                    </div>
                    <div style={{ width: "100%", height: 2 }}></div>
                    <div style={{}}>
                      <div
                        className="email"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          position: "relative",
                          marginLeft: sideMargins,
                        }}
                      >
                        <a href="mailto:matthijs@fam-vaessen.eu">
                          <div className="center">
                            <HiOutlineMail size={80} color="white" />
                          </div>
                        </a>
                      </div>
                      <div
                        className="linkedin"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                        onClick={() => {
                          window.open(
                            "https://www.linkedin.com/in/matthias-vaessen-b60839162/"
                          );
                        }}
                      >
                        <div className="center">
                          <FaLinkedin size={80} color="white" />
                        </div>
                      </div>
                      <div
                        className="phone"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                      >
                        <a href="tel:+31642863933">
                          <div className="center">
                            <FaPhoneAlt size={60} color="white" />
                          </div>
                        </a>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 2,
                        backgroundColor: "black",
                      }}
                    ></div>
                    <div style={{}}>
                      <div
                        className="spotify"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          position: "relative",
                          marginLeft: sideMargins,
                        }}
                        onClick={() => {
                          window.open(
                            "https://open.spotify.com/user/t9yosouipe721gkkl4v76tge8?si=hN7ZIO05TS6YApUiKCQ3BA&utm_source=copy-link"
                          );
                        }}
                      >
                        <div className="center">
                          <FaSpotify size={80} color="white" />
                        </div>
                      </div>
                      <div
                        className="github"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                        onClick={() => {
                          window.open("https://github.com/matthijsgv/");
                        }}
                      >
                        <div className="center">
                          <FaGithub size={60} color="white" />
                        </div>
                      </div>
                      <div
                        className="paypal"
                        style={{
                          float: "left",
                          width: gridWidth,
                          height: gridWidth,
                          marginLeft: middleMargins,
                          position: "relative",
                        }}
                        onClick={() => {
                          window.open(
                            "https://www.paypal.com/paypalme/matthijsvaessen"
                          );
                        }}
                      >
                        <div className="center">
                          <FaPaypal size={80} color="white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 30,
                      position: "relative",
                      borderTop: "2px solid white",
                      marginTop: 2,
                    }}
                  >
                    <span
                      className="center"
                      style={{
                        color: "white",
                        fontSize: 8,
                        textAlign: "center",
                      }}
                    >
                      © Matthijs Vaessen
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default App;
