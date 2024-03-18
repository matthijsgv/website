import Countdown, { zeroPad } from "react-countdown";
import "../style/WanneerZieIkXanaWeer.css";
import { FaPlane } from "react-icons/fa";


const ShowCountdown = (props) => {

    const SingleDisplay = (props) => {
        return <div className="wanneer-countdown-display-outer">
            <div className="wanneer-countdown-display">
                <div className="wanneer-countdown-value">
                    {props.value}
                </div>
                <div className="wanneer-countdown-label">
                    {props.label}
                </div>
            </div>
        </div>
    };

    return <div className="wanneer-countdown-outer">
        <div className="plane">
            <div className="plane-circle">
                <div className="plane-circle-inner">
                <div className="plane-circle-plane"><FaPlane /></div>

                </div>
            
            </div>
        </div>
        <SingleDisplay value={zeroPad(props.days)} label="Dagen" />
        <SingleDisplay value={zeroPad(props.hours)} label="Uur" />
        <SingleDisplay value={zeroPad(props.minutes)} label="Minuten" />
        <SingleDisplay value={zeroPad(props.seconds)} label="Seconden" />

    </div>
};


const WanneerZieIkXanaWeer = () => {

    const date = new Date(process.env.REACT_APP_NEXT_DATE)
    return <div className="wanneer-outer">
        
        <Countdown className="counterdown" date={date} renderer={ShowCountdown} />

    </div>;
}

export default WanneerZieIkXanaWeer;