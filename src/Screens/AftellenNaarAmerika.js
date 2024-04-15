import "../style/AftellenNaarAmerika.css";
import syena from "../images/amerika/syena.png";
import syena2 from "../images/amerika/syena2.png";
import fam from "../images/amerika/fam.png";
import martin from "../images/amerika/martin.png";
import trump from "../images/amerika/trump.png";
import vegas from "../images/amerika/vegas.png";
import cheran from "../images/amerika/cheran.jpg";
import xaantje from "../images/amerika/xaantje.png";
import Countdown, { zeroPad } from "react-countdown";

const AftellenNaarAmerika = () => {

    const AmerikaCountdown = (props) => {
        const SingleDisplay = (props) => {
            return <div className="amerika_countdown_display_single">
                    <div className="amerika_countdown_display_value">
                        {props.value}
                    </div>
                    <div className="amerika_countdown_display_label">
                        {props.label}
                    </div>
            </div>
        };
    
        return <div className="amerika_countdown_display_outer">
            <SingleDisplay value={zeroPad(props.days)} label="Dagen" />
            <SingleDisplay value={zeroPad(props.hours)} label="Uur" />
            <SingleDisplay value={zeroPad(props.minutes)} label="Minuten" />
            <SingleDisplay value={zeroPad(props.seconds)} label="Seconden" />
    
        </div>
    };
    return <div className="amerika-outer">
             <div className="amerika_background" ></div>
             <img id="syena" className="popup-picture" src={syena} alt="syena"></img>
             <img id="syena2" className="popup-picture" src={syena2} alt="syena2"></img>
             <img id="fam" className="popup-picture" src={fam} alt="fam"></img>
             <img id="martin" className="popup-picture" src={martin} alt="martin"></img>
             <img id="trump" className="popup-picture" src={trump} alt="trump"></img>
             <img id="vegas" className="popup-picture" src={vegas} alt="vegas"></img>
             <img id="cheran" className="popup-picture" src={cheran} alt="cheran"></img>
             <img id="xaantje" className="popup-picture" src={xaantje} alt="xaantje"></img>
             <div className="amerika_countdown">
                <div className="amerika_countdown_title">
                    Dagen tot Amerika
                </div>
                <div className="amerika_countdown_display">
                <Countdown date={new Date("2024-06-08T15:00:00+02:00")} renderer={AmerikaCountdown} />

                </div>
             </div>

    </div>
}

export default AftellenNaarAmerika;