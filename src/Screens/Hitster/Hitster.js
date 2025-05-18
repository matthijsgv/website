import React, { useContext, useEffect, useState } from "react";
import SpotifyLoginScreen from "Screens/SpotifyLoginScreen";
import SpotifyContext from "store/spotify-context";
import "../../style/Hitster.css";

const Hitster = () => {
  const ctx = useContext(SpotifyContext);

  const [firstPlay, setFirstPlay] = useState(false);

  useEffect(() => {
    console.log("TOKEN UPDATED TO", ctx.token);
  },[ctx.token]);


  const togglePlay = (trackid) => {
    if (!firstPlay) {
      ctx.playTrack(trackid);
      setFirstPlay(true);
    } else {
      ctx.togglePlay();
    }
  } 
  return (
    <div>
      {ctx.token === null && (
        <SpotifyLoginScreen
          redirectUrl={process.env.REACT_APP_SPOTIFY_REDIRECT_URL_HITSTER}
        />
      )}
      {ctx.token !== null && <div className="hitster_outer">
        <div className="play_pause_button" onClick={() => togglePlay("4u7EnebtmKWzUH433cf5Qv")}>

          </div>
        </div>}
      
    </div>
  );
};

export default Hitster;
