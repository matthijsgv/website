import React, { useEffect, useState } from "react";
import { StoragePath } from "../Constants/StoragePath";


const UserContext = React.createContext({
    username: "",
    name: "",
    loggedIn: true,
    role: "",
    prefferedTheme: "",
    changeTheme: (s) => { },
    login: async (u, p) => false,
    logout: () => { }
});

export const UserContextProvider = (props) => {

    const validThemes = ["dark", "light"];
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    const [theme, setTheme] = useState("dark");

    const changeTheme = (theme) => {
        if (!validThemes.includes(theme)) return;
        setTheme(theme);
        localStorage.setItem(StoragePath.THEME_STORAGE, theme);
    };

    const authorize = async (token) => {
        await fetch(`https://p1-energie-meting-backend.onrender.com/api/user/authorize?token=${token}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        })
            .then((result) => {
                if (!result.ok) {
                    throw new Error("Unauthorized");
                }
                return result.json()
            })
            .then((response) => {
                setLoggedIn(true);
                setUsername(response.username);
                setName(response.name);
                setRole(response.role);
            }).catch(() => {
                console.log("Nu is ie caught");
            })
    };

    useEffect(() => {
        const token = localStorage.getItem(StoragePath.TOKEN_STORAGE);
        if (token) {
            authorize(token);
        }
    }, []);

    const logout = () => {
        setName("");
        setRole("");
        setLoggedIn(false);
        setUsername("");
        localStorage.removeItem(StoragePath.TOKEN_STORAGE);
    };

    const logIn = async (username, password) => {
        return await fetch("https://p1-energie-meting-backend.onrender.com/api/user/login", {
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
            .then((result) => {
                if (!result.ok) {
                    throw new Error("Unauthorized");
                }
                return result.json()
            })
            .then((response) => {
                setLoggedIn(true);
                localStorage.setItem(StoragePath.TOKEN_STORAGE, response.token);
                setUsername(response.username);
                setName(response.name);
                setRole(response.role);
                return true
            }).catch((e) => {

                console.log("Nu is ie caught");
                return false;
            })

    };

    //load theme
    useEffect(() => {
        const prefferedTheme = localStorage.getItem(StoragePath.THEME_STORAGE);
        if (prefferedTheme === null || !validThemes.includes(prefferedTheme)) {
            localStorage.setItem(StoragePath.THEME_STORAGE, theme);
            return;
        }

        setTheme(prefferedTheme);
        // eslint-disable-next-line
    }, []);

    return <UserContext.Provider value={{
        username: username,
        name: name,
        loggedIn: loggedIn,
        role: role,
        prefferedTheme: theme,
        changeTheme: changeTheme,
        login: logIn,
        logout: logout
    }} >
        {props.children}
    </UserContext.Provider>
};

export default UserContext;