import { useState } from "react";
import { MdOutlineToday } from "react-icons/md";
import Moment from "moment";
import localization from "moment/locale/nl";
import { AddActionModal } from "./AddActionModal";
import { DisplayActionModal } from "./DisplayActionModal";
import { KalenderAddButton } from "./KalenderAddButton";

export const KalenderModal = (props) => {
  console.log("Actions", props.actions);
  const [curScreen, setCurScreen] = useState("overview");
  document.addEventListener("click", (e) => {
    if (e.target.id === "backdrop") {
      props.setShowDay(false);
    }
  });

  const onClickAddButton = () => {
    setCurScreen("add");
  };
  return (
    <div id="backdrop" className="day_modal_backdrop">
      <div id="modal_inner" className="day_modal_inner">
        <div className="modal_top_bar">
          <div className="day_modal_date">
            <MdOutlineToday />{" "}
            {Moment(props.day)
              .locale("nl", localization)
              .format("dddd D MMMM YYYY")
              .split(" ")
              .map((val, idx) => {
                if (idx === 0 || idx === 2) {
                  return val.charAt(0).toUpperCase() + val.substring(1);
                }
                return val;
              })
              .join(" ")}
          </div>
        </div>
        <div className="modal_content">
          {curScreen === "overview" && props.actions.length === 0 && (
            <NoActionModal onClickAddButton={onClickAddButton} />
          )}
          {curScreen === "overview" && props.actions.length > 0 && (
            <DisplayActionModal
              actions={props.actions}
              onClickAddButton={onClickAddButton}
            />
          )}
          {curScreen === "add" && (
            <AddActionModal date={props.day} standjes={props.standjes} />
          )}
        </div>
      </div>
    </div>
  );
};

const NoActionModal = (props) => {
  return (
    <>
      <div className="day_modal_no_entries">Geen seks gehad op deze dag...</div>
      <KalenderAddButton onClick={props.onClickAddButton} />
    </>
  );
};
