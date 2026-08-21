import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { FaSpotify } from "react-icons/fa";
import SpotifyContext from "../store/spotify-context";
import "../style/SpotifyLoginScreen.css";
import { useSearchParams } from "react-router-dom";

const generateCodeVerifier = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

const generateCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
};

const SpotifyLoginScreen = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [poweredBySpotifyShown, setPoweredBySpotifyShown] = useState(true);

  const ctx = useContext(SpotifyContext);

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
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
          onClick={async () => {
            const verifier = generateCodeVerifier();
            const challenge = await generateCodeChallenge(verifier);
            sessionStorage.setItem("spotify_pkce_verifier", verifier);

            const state = generateCodeVerifier().substring(0, 16);
            const params = new URLSearchParams({
              client_id: process.env.REACT_APP_CLIENT_ID,
              redirect_uri: props.redirectUrl,
              response_type: "code",
              scope: SCOPES,
              state,
              code_challenge_method: "S256",
              code_challenge: challenge,
            });
            window.location.replace(`${AUTH_ENDPOINT}?${params}`);
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
