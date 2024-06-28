import { useState, useEffect } from "react";
import Moment from "moment";
import { actions } from "./actions";
import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";
import {
  MdFormatListBulletedAdd,
  MdOutlineAddCircleOutline,
} from "react-icons/md";

export const AddActionModal = (props) => {
  const submit = () => {
    const payload = {
      date: Moment(props.date).format("YYYY-MM-DD"),
      actions: chosenActions,
      positions: positions,
      rating: rating,
      remarks: remarks.trim(),
    };

    console.log(payload);
  };

  const [chosenActions, setChosenActions] = useState([]);
  const [rating, setRating] = useState(0);
  const [positions, setPositions] = useState([]);
  const [remarks, setRemarks] = useState("");
  return (
      <>
      <p className="modal_title">Wat hebben jullie gedaan?</p>
      <ChooseActions setChosenActions={setChosenActions} />
      <p className="modal_title">Welke standjes hebben jullie gedaan?</p>
      <Standjes setPositions={setPositions} standjes={props.standjes} />

      <p className="modal_title">Hoe was het?</p>
      <div className="modal_stars_rating">
        <Stars rating={rating} setRating={setRating} />
      </div>

      <p className="modal_title">Opmerkingen</p>
      <div className="modal_text_area_outer">
        <textarea
          className="modal_text_area"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>
      <button className="modal_submit_button" onClick={() => submit()}>
        Opslaan
      </button>
    </>
  );
};

const ChooseActions = (props) => {
  const [selectedActions, setSelectedActions] = useState(
    actions.map((x) => {
      return { id: x.id, action: x.action, selected: false };
    })
  );

  useEffect(() => {
    props.setChosenActions(
      selectedActions.filter((x) => x.selected).map((x) => x.id)
    );
    // eslint-disable-next-line
  }, [selectedActions]);

  const Action = (props) => {
    return (
      <div className="action_option">
        <input
          type="checkbox"
          onChange={(e) => {
            props.setSelectedActions((state) => {
              let temp = [...state];
              temp[props.idx].selected = e.target.checked;
              return temp;
            });
          }}
          checked={props.action.selected}
        />{" "}
        {props.action.action}
      </div>
    );
  };

  return (
    <>
      {selectedActions.map((action, idx) => {
        return (
          <Action
            key={action.id}
            idx={idx}
            action={action}
            setSelectedActions={setSelectedActions}
          />
        );
      })}
    </>
  );
};

const Standjes = (props) => {
  const [addStandje, setAddStandje] = useState("");
  const postNewPos = () => {
    fetch(`http://localhost:8080/api/kalender/positions/${addStandje}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  };
  const onAddStandje = () => {
    if (addStandje.length < 3) return;
    postNewPos();
    setSelectedStandjes((state) => [
      ...state,
      { standje: addStandje, selected: true },
    ]);

    setAddStandje("");
  };

  const [selectedStandjes, setSelectedStandjes] = useState(
    props.standjes.map((x) => {
      return { standje: x, selected: false };
    })
  );

  useEffect(() => {
    props.setPositions(
      selectedStandjes.filter((x) => x.selected).map((x) => x.standje)
    );
    // eslint-disable-next-line
  }, [selectedStandjes]);

  return (
    <div className="standjes_outer">
      {selectedStandjes.map((x, idx) => {
        return (
          <div key={x.standje} className="standje_inner">
            <input
              type="checkbox"
              onChange={(e) =>
                setSelectedStandjes((state) => {
                  let temp = [...state];
                  temp[idx] = { ...temp[idx], selected: e.target.checked };
                  return temp;
                })
              }
              checked={x.selected}
            />{" "}
            {x.standje}
          </div>
        );
      })}
      <div className="standje_input">
        <MdFormatListBulletedAdd />
        <div className="standje_input_outer">
          <input
            type="text"
            placeholder="Anders, namelijk..."
            onKeyDown={(e) => {
              console.log(e);
              if (e.key === "Enter") {
                onAddStandje();
              }
            }}
            value={addStandje}
            onChange={(e) => setAddStandje(e.target.value)}
          />
          <div className="standje_input_button" onClick={() => onAddStandje()}>
            {addStandje.length >= 3 && <MdOutlineAddCircleOutline />}
          </div>
        </div>
      </div>
    </div>
  );
};

const Stars = (props) => {
  const ratingClicked = (num) => {
    if (num === 1 && props.rating === 1) props.setRating(0);
    else props.setRating(num);
  };

  return (
    <div className="stars_outer">
      <div
        className="stars_outer_pad"
        onClick={() => {
          props.setRating(0);
        }}
      ></div>
      {[1, 2, 3, 4, 5].map((x) => (
        <Star
          key={"star" + x}
          rating={props.rating}
          num={x}
          ratingClicked={ratingClicked}
        />
      ))}
      <div
        className="stars_outer_pad"
        onClick={() => {
          props.setRating(10);
        }}
      ></div>
    </div>
  );
};

const Star = (props) => {
  const [filled, setFilled] = useState("not");

  useEffect(() => {
    if (props.rating > (props.num - 1) * 2) {
      if (props.rating > props.num * 2 - 1) {
        setFilled("full");
      } else {
        setFilled("half");
      }
    } else {
      setFilled("not");
    }
  }, [props.num, props.rating]);

  return (
    <div key={`star${props.num}`} className="star_outer">
      <div
        className="half_star left"
        onClick={() => {
          props.ratingClicked(props.num * 2 - 1);
        }}
      ></div>
      <div
        className="half_star right"
        onClick={() => {
          props.ratingClicked(props.num * 2);
        }}
      ></div>
      {filled === "not" && <TbStar />}
      {filled === "half" && <TbStarHalfFilled />}
      {filled === "full" && <TbStarFilled />}
    </div>
  );
};
