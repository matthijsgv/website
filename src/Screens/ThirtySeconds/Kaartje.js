import "../../style/ThirtySeconds/Kaartje.css";

const Kaartje = (props) => {
  return (
    <div
      key={props.woorden.toString()}
      className={
        "kaartje-outer" + (props.kleur === "yellow" ? " yellow" : " blue")
      }
    >
      <div className="kaartje-rand-text links">HALVE MINUUT</div>
      <div className="kaartje-rand-text rechts">HALVE MINUUT</div>

      <div
        className={
          "kaartje-inner" + (props.kleur === "yellow" ? " yellow" : " blue")
        }
      >
        <div className="kaartje-woorden">
          {props.woorden.map((woord) => {
            return <div>{woord.toUpperCase()}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Kaartje;
