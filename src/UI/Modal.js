import "../style/Modal.css";

const Modal = (props) => {

    return <div className="modal-outer">
    <div className="backdrop" onClick={props.closeModal}>

    </div>
    <div className="modal" >
            {props.children}
        </div>
    </div> 
};

export default Modal;