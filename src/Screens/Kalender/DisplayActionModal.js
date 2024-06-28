import { actions } from "./actions";
import { FaXmark, FaCheck, FaAsterisk } from "react-icons/fa6";
import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";
import { KalenderAddButton } from "./KalenderAddButton";

export const DisplayActionModal = (props) => {
  const DisplayAction = (props) => {
    console.log(props.action);
    return (
      <div className="display_action">
        <div className="display_actions">
          {actions.map((a) => {
            let didThis = props.action.actions.includes(a.id);
            return (
              <div className="display_single_action">
                {didThis ? (
                  <FaCheck className="display_check" />
                ) : (
                  <FaXmark className="display_x_mark" />
                )}{" "}
                {a.action}
              </div>
            );
          })}
        </div>
        <div className="display_title">Standjes</div>
        <div className="display_positions">
          {[
            "Doggy",
            "Lepeltje",
            "Cowgirl",
            "Reverse Cowgirl",
            "Vieze anaal",
            "Kont eten",
          ].map((pos) => {
            return (
              <div className="display_position">
                {" "}
                <FaAsterisk className="asterisk" /> {pos}
              </div>
            );
          })}
        </div>
        <div className="display_title">Rating</div>
        <DisplayStars rating={props.action.rating} />
        <div className="display_title">Opmerkingen</div>
        <div className="display_remarks">
          {props.action.remarks === "" ? "-" : props.action.remarks}
        </div>
      </div>
    );
  };

  return (
      <>
          DisplayActionModal
      {props.actions.map((action) => {
        return <DisplayAction action={action} />;
      })}
      <KalenderAddButton onClick={props.onClickAddButton} />
    </>
  );
};

const DisplayStars = (props) => {
  const Star = (props) => {
    return (
      <>
        {props.rating / 2 > props.id ? (
          <TbStarFilled />
        ) : props.rating / 2 > props.id - 1 ? (
          <TbStarHalfFilled />
        ) : (
          <TbStar />
        )}
      </>
    );
  };

  return (
    <div
      className={
        props.rating > 0 ? "display_stars" : "display_stars not_available"
      }
    >
      {[1, 2, 3, 4, 5].map((x) => {
        return <Star id={x} rating={props.rating} />;
      })}
    </div>
  );
};
