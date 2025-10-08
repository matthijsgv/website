import screenMap from "Components/HitsterComponents/HitsterScreenMap";
import React, { useContext, useEffect } from "react";
import SpotifyLoginScreen from "Screens/SpotifyLoginScreen";
import HitsterContext from "store/hitster-context";
import SpotifyContext from "store/spotify-context";

const HitsterInner = (props) => {
  const ctx = useContext(SpotifyContext);
  const hctx = useContext(HitsterContext);

    const CurrentScreen = screenMap[hctx.currentScreen] || null;

    useEffect(() => {
        if (ctx.token !== null && hctx.currentTrack === null && hctx.nextTrack !== null) {
            hctx.getNextTrack();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.token, hctx.currentTrack, hctx.nextTrack]);

  return (
    <>
      {ctx.token === null ? (
        <SpotifyLoginScreen
          redirectUrl={process.env.REACT_APP_SPOTIFY_REDIRECT_URL_HITSTER}
        />
      ) : (
        CurrentScreen && <CurrentScreen />
      )}
    </>
  );
};

export default HitsterInner;
