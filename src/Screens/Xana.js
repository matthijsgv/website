import "../style/Xana.css";
import kattenGIF from "../images/begging.gif";
import kissCat from "../images/kisscat.gif";
import prosecco from "../images/prosecco.png"
import catlick from "../images/catlick.gif"
import { useState } from "react";

const Xana = () => {

    const [noPresses, setNoPresses] = useState(0);
    const [yesPressed, setYesPressed] = useState(false);

    return <div className="xana-outer">
        {yesPressed ? <div>
            <div className="katten-gif-outer">
                <img src={kissCat} alt="katkus" />
            </div>
            <div className="xana-vraag"> Joepie !!! <br />
            Je cadeautje is een tegoedbon voor...
             </div>
             <div className="xana-tegoedbon">
                <div className="xana-prosecco">
             <img src={prosecco} alt="prosecco"  /> 
             </div>
              <div className="xana-plus">+</div>
              <div className="xana-lik-gif">
             <img src={catlick} alt="catlick"  /> 
             </div>
                </div>
        </div> : <div>
            <div className="katten-gif-outer">
                <img src={kattenGIF} alt="kat" />
            </div>
            <div className="xana-vraag">
                Lieve Xana,<br />
                Wil je mijn Valentijn zijn?
            </div>
            <div className="xana-knoppen">
                <div className="xana-ja-knop" onClick={() => setYesPressed(true)}>
                    Ja !
                </div>
                <div className="xana-nee-knop-outer">
                    <div className="xana-nee-knop" style={{ transform: `scale(${0.9 ** noPresses})` }} onClick={() => setNoPresses(state => state + 1)}>
                        Nee :(
                    </div>
                </div>
            </div>
        </div>}
    </div>;
};
export default Xana;