import Slider from "react-slick";
import "../style/Tools.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GuitarTunerIcon from "../UI/GuitarTunerIcon";
import { useNavigate } from "react-router-dom";

import CalculatorTile from "../UI/CalculatorTile";

const Carousel = (props) => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
  };

  return (
    <Slider className="custom-dots" {...settings}>
      <div>
        <div className="single_tool">
          <div
            className="single_tool_content"
            onClick={() => {
              navigate("/guitar_tuner");
            }}
          >
            <div className="single_tool_inner">
              <div className="guitar_tuner_tool_icon">
                <GuitarTunerIcon
                  size="6vw"
                  backgroundColor={"rgb(168, 145, 66)"}
                  forkColor={"black"}
                />
              </div>
              <div className="guitar_tuner_title">Guitar Tuner</div>
              <div className="guitar_tuner_tool_hole"></div>
              <div value="1" className="guitar_tuner_tool_string"></div>
              <div value="2" className="guitar_tuner_tool_string"></div>
              <div value="3" className="guitar_tuner_tool_string"></div>
              <div value="4" className="guitar_tuner_tool_string"></div>
              <div value="5" className="guitar_tuner_tool_string"></div>
              <div value="6" className="guitar_tuner_tool_string"></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className="single_tool"
          onClick={() => {
            navigate("/calculator");
          }}
        >
          <CalculatorTile />
        </div>
      </div>
    </Slider>
  );
};

const Tools = () => {
  return (
    <div className="tools_outer">
      <Carousel />
    </div>
  );
};

export default Tools;
