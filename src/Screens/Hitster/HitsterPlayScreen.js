import LoadingIndicator from "Components/LoadingIndicator";
import React, { useContext, useEffect, useState } from "react";
import HitsterContext from "store/hitster-context";
import SpotifyContext from "store/spotify-context";
import HitsterScreen from "./HitsterScreen";
import HitsterKaartje from "Components/HitsterComponents/HitsterKaartje";
import Timeline from "Components/HitsterComponents/Timeline";
import { GiBuyCard } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";

import "../../style/Hitster/HitsterPlayScreen.css";

const HitsterPlayScreen = () => {
  const ctx = useContext(SpotifyContext);
  const hitsterContext = useContext(HitsterContext);

  const [firstPlay, setFirstPlay] = useState(false);


  const [ableToHitster, setAbleToHitster] = useState(false);

  const [currentHitsterAttempt, setCurrentHitsterAttempt] = useState(null);

  const onPlayPause = () => {
    if (!firstPlay) {
      // @ts-ignore
      ctx.playTrack(hitsterContext.currentTrack.id);
      setFirstPlay(true);
    } else {
      ctx.togglePlay();
    }
  };

  useEffect(() => {
    if (hitsterContext.currentTrack) {
      setFirstPlay(false);
    }
  }, [hitsterContext.currentTrack]);

  const onLockIn = () => {
    hitsterContext.setGamePhase("lockedIn");
    setAbleToHitster(true);
  };

  const PlayOrLoad = (props) => {
    const hitsterContext = useContext(HitsterContext);

    return (
      <div>
        {hitsterContext.currentTrack === null ? (
          <LoadingIndicator
            colors={{
              mainColor: "#ED33B9",
              secondairyColor: "grey",
            }}
            style={{ size: "18vw", thickness: "0.3vw" }}
            mobileStyle={{ size: "60vw", thickness: "1vw" }}
          />
        ) : (
          <HitsterKaartje
            playing={ctx.playing}
            currentTrack={hitsterContext.currentTrack}
            onPlayPause={onPlayPause}
            onLockIn={props.onLockIn}
            ableToHitster={ableToHitster}
            track={hitsterContext.currentTrack}
            tryingToHitster={currentHitsterAttempt !== null}
          ></HitsterKaartje>
        )}
      </div>
    );
  };

  const onHitster = (indicator) => {
    hitsterContext.setGamePhase("tryingToHitster");
    setCurrentHitsterAttempt(indicator);
  };

  const BuyCardButton = (props) => {
    return (
      <>
        {hitsterContext.isBuyingCard ? (
          <div
            className="hitster_play_screen_buy_card_button"
            onClick={() => hitsterContext.setIsBuyingCard(false)}
          >
            <FaArrowLeft />
          </div>
        ) : (
          <div
            className="hitster_play_screen_buy_card_button"
            onClick={() => hitsterContext.setIsBuyingCard(true)}
          >
            <GiBuyCard />
          </div>
        )}
      </>
    );
  };

  return (
    <HitsterScreen key={hitsterContext.gameKey}>
      <div className="hitster_play_screen_outer">
        <div className="hitster_play_screen_new_card">
          <BuyCardButton />
          <PlayOrLoad onLockIn={onLockIn} />
        </div>
        <Timeline
          player={hitsterContext.currentPlayer()}
          ableToHitster={ableToHitster}
          onHitster={onHitster}
        />
      </div>
    </HitsterScreen>
  );
};

export default HitsterPlayScreen;
