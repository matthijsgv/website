import React from 'react';
import Slider from "react-slick";
import "../style/Tools.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { MdArrowBack } from "react-icons/md";

import TopBar from "../UI/TopBar";
import { RoutePath } from "../Constants/RoutePath";
import CalculatorTile from "../UI/CalculatorTile";

const Slide = (props) => {

  const [isClick, setIsClick] = useState(true);
  const clickTimeoutRef = useRef(null);

  const handleMouseDown = () => {
    clickTimeoutRef.current = setTimeout(() => {
      setIsClick(false);
    }, 150);
  };

  const handleClick = () => {
    if (isClick) {
      props.onClick();
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      setIsClick(true);
    }
  };

  return <div className="single-slide" onMouseDown={handleMouseDown}
    onClick={handleClick}>
    {props.children}
  </div>

}

const Carousel = (props) => {
  const navigate = useNavigate();

  const settings = {
    adaptiveHeight: false,
    variableWidth: false,
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider className="custom-dots" {...settings}>
      <Slide onClick={() => navigate(RoutePath.PIANO)}>
        <div className="tools_piano_outer">
          <div className="tools_piano_key">
            <div className="tool_piano_black_key"></div>
          </div>
          <div className="tools_piano_key second">
            <div className="tool_piano_black_key"></div>
          </div>
          <div className="tools_piano_key third"></div>
        </div>
        <div className="tool_title">
          Play Piano
        </div>
      </Slide>
      <Slide onClick={() => navigate(RoutePath.GUITAR_TUNER)}>
        <div className="tools_guitar_tuner">
          {[...Array(99).keys()]
            .map((x) => x - 49)
            .map((item) => {
              return (
                <div
                  key={Math.random().toString()}
                  id={`tool_guitar_tuner_${item}`}
                  style={{ "--deg": item.toString() }}
                  className={`tools_guitar_tuner_line${item % 10 !== 0 ? " small" : ""
                    }`}
                >
                  &#124;
                </div>
              );
            })}
          <div className="tools_guitar_tuner_arrow_bottom">
            <div className="tools_guitar_tuner_arrow">
              <div className="tools_guitar_tuner_arrow_head"></div>
            </div>
          </div>
        </div>
        <div className="tool_title">
          Guitar Tuner
        </div>
      </Slide>
      <Slide onClick={() => navigate(RoutePath.CALCULATOR)}>
        <div className="tools_calculator_outer">
          <div className="tools_calculator_screen">
            <CalculatorTile />
          </div>
          <div className="tools_calculator_buttons">
            {[...Array(20).keys()].map(x => {
              return <div key={`button_${x}`} className="tools_calculator_buttons_single"></div>
            })}
          </div>
        </div>
        <div className="tool_title">
          Calculator
        </div>
      </Slide>

    </Slider>
  );
};

const Tools = () => {

  const navigate = useNavigate();
  return (
    <div className="tools_outer_outer">
      <TopBar title="Tools" leftIcon={{
        onClick: () => navigate(RoutePath.ROOT),
        Icon: MdArrowBack
      }} />


      <div className="tools_outer">
        <Carousel />
      </div>
    </div>
  );
};

export default Tools;
