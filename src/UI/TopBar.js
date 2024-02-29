import "../style/UI/TopBar.css";

const TopBar = (props) => {
    return <div className="topbar">
        {props.title}
        {props.children}
    </div>
};

export default TopBar;