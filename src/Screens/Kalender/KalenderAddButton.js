import { MdAddCircleOutline } from "react-icons/md";


export const KalenderAddButton = (props) => {
    return               <div
    className="modal_add_button"
    onClick={props.onClick}
  >
    <div className="modal_add_button left">
      <MdAddCircleOutline />
    </div>
    <div className="modal_add_button right">Toevoegen</div>
  </div>
}