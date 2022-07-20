import { useEffect, useState } from 'react';

const MusicQuiz = () => {

    const CLIENT_ID = "c4af7145099a4bed866f9c39f3ab7d0f";
    const REDIRECT_URI = "http://192.168.206.146:3000";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("");


    return <div>
        {
            !token && <div>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
                </div>
        }
    </div>
};

export default MusicQuiz;