import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { FaSpotify } from "react-icons/fa";
import SpotifyContext from "store/spotify-context";
import "../style/SpotifyLoginScreen.css";
import { useSearchParams } from "react-router-dom";

const SpotifyLoginScreen = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [poweredBySpotifyShown, setPoweredBySpotifyShown] = useState(true);

  const ctx = useContext(SpotifyContext);

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";
  const SCOPES =
    "user-modify-playback-state streaming user-read-email user-read-private user-read-playback-state app-remote-control user-library-modify user-library-read";

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ctx.loadTokenFromStorage()) return;

      let code = searchParams.get("code");
      setSearchParams({});

      if (code) {
        ctx.fetchToken(code, props.redirectUrl);
      } else {
        setPoweredBySpotifyShown(false);
      }
    }, 2000); // Delay in milliseconds

    return () => clearTimeout(timeout); // Clean up on unmount
    // eslint-disable-next-line
  }, []);

  return (
    <div className="spotify_login_outer">
      {poweredBySpotifyShown ? (
        <PoweredBySpotifyScreen />
      ) : (
        <div
          className="spotify_login_button"
          onClick={() => {
            // ctx.setToken(null);
            let state = (Math.random() + 1).toString(36).substring(16);
            window.location.replace(
              `${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${props.redirectUrl}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&state=${state}`
            );
          }}
        >
          <FaSpotify /> Login to Spotify
        </div>
      )}
    </div>
  );
};

const PoweredBySpotifyScreen = () => {
  return (
    <div className="spotify_powered_by_inner">
      <div className="spotify_powered_by_upper">Powered by</div>
      <div className="spotify_powered_by_lower">
        <div className="spotify_powered_by_icon">
          <FaSpotify />
        </div>{" "}
        Spotify
      </div>
    </div>
  );
};

export default SpotifyLoginScreen;
