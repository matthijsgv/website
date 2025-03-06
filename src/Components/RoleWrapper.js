import React from 'react';
import { useContext } from "react";
import UserContext from "../store/user-context";

const RoleWrapper = (props) => {

    const uctx = useContext(UserContext);
    return props.allowedRoles.includes(uctx.role) ? props.children : <div></div> 
}

export default RoleWrapper;