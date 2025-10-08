import ReactDOM from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaEye, FaTrash, FaXmark } from "react-icons/fa6";
import "../../style/Components/HitsterComponents/HitsterKaartje.css";
import { BsMusicNote, BsMusicNoteBeamed } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useHitsterContext } from "../../store/hitster-context";

import { TbUserFilled } from "react-icons/tb";
import tinycolor from "tinycolor2";
import { gamePhases } from "./GamePhases";
import { useScreenWidth } from "util/useScreenWidth";
import { GiBuyCard } from "react-icons/gi";


const HitsterKaartje = (props) => {
  const hitsterContext = useHitsterContext();

  return props.inTimeline ? (
    <HitsterKaartjeTimeline track={props.track} />
  ) : (
    <>
      {hitsterContext.isBuyingCard ? (
        <HitsterKaartjeBuyCard />
      ) : (
        <>
          {hitsterContext.gamePhase === gamePhases.READY_TO_LOCK_IN && (
            <HitsterKaartjeLockIn onLockIn={props.onLockIn} />
          )}
          {hitsterContext.gamePhase === gamePhases.LOCKED_IN && (
            <HitsterKaartjeHitster />
          )}
          {hitsterContext.gamePhase === gamePhases.TRYING_TO_HITSTER && (
            <HitsterKaartjePlayers />
          )}
          {hitsterContext.gamePhase === gamePhases.REMOVING_HITSTER && (
            <HitsterKaartjeRemoveHitster />
          )}
          {hitsterContext.gamePhase === gamePhases.PLAYING && (
            <HitsterKaartjeSongPlayer
              playing={props.playing}
              onPlayPause={props.onPlayPause}
              onReveal={props.revealCard}
            />
          )}
          {hitsterContext.gamePhase === gamePhases.REVEALED && (
            <HitsterKaartjeRevealed track={props.track} />
          )}
        </>
      )}
    </>
  );
};

const HitsterKaartjeBuyCard = (props) => {
  const hitsterContext = useHitsterContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const playersToFilter = [];

  const onSelectPlayer = (player) => {
    console.log("Selected player:", player);
    setSelectedPlayer(player);
  };

  useEffect(() => {
    console.log("Selected player changed:", selectedPlayer);
  }, [selectedPlayer]);
  return (
    <HitsterKaartjeBack {...props}>
      <div className="hitster_kaartje_player_list_outer">
        {selectedPlayer === null && (
          <>
            Who wants to buy a card?
            <HitsterKaartjePlayerList
              playersToFilter={playersToFilter}
              onSelectPlayer={onSelectPlayer}
            />
          </>
        )}
        {selectedPlayer !== null && (
          <div className="hitster_kaartje_buy_card_content">
            <div>
            Are you sure you want to buy a card, {" "}
            <span className="hitster_kaartje_player_name">
              {selectedPlayer.name}
            </span>
            ?
            </div>
            <div className="hitster_kaartje_remove_buttons">
              <HitsterKaartjeButton
                small={true}
                onClick={() => {
                  console.log("Buying card for player:", selectedPlayer.name);
                  hitsterContext.buyCard(selectedPlayer.name);
                }}
                icon={GiBuyCard}
              />
              <HitsterKaartjeButton
                small={true}
                onClick={() => {
                  setSelectedPlayer(null);
                }}
                icon={FaXmark}
              />
            </div>
          </div>
        )}
      </div>
    </HitsterKaartjeBack>
  );
};

const HitsterKaartjeRemoveHitster = (props) => {
  const hitsterContext = useHitsterContext();

  return (
    <HitsterKaartjeBack {...props}>
      <div className="hitster_kaartje_remove_hitster_content">
        Do you want to remove the hitster of Player?
        <div className="hitster_kaartje_remove_buttons">
          <HitsterKaartjeButton
            small={true}
            onClick={() => {
              hitsterContext.removeHitsterGuess();
            }}
            icon={FaTrash}
          />
          <HitsterKaartjeButton
            small={true}
            onClick={() => {
              hitsterContext.setGamePhase(gamePhases.LOCKED_IN);
            }}
            icon={FaXmark}
          />
        </div>
      </div>
    </HitsterKaartjeBack>
  );
};

const HitsterKaartjeLockIn = (props) => {
  const hitsterContext = useHitsterContext();

  return (
    <HitsterKaartjeBack {...props}>
      <div className="hitster_kaartje_locked_in_content">
        Do you want to lock in your choice?
        <HitsterKaartjeButton
          onClick={() => hitsterContext.setGamePhase(gamePhases.LOCKED_IN)}
          icon={FaLock}
        />
      </div>
    </HitsterKaartjeBack>
  );
};

const HitsterKaartjeButton = (props) => {
  return (
    <div
      className={`hitster_kaartje_button ${props.small ? "small" : ""}`}
      onClick={() => props.onClick()}
    >
      {<props.icon className="hitster_kaartje_button_icon" />}
    </div>
  );
};

const HitsterKaartjeHitster = (props) => {
  const hitsterContext = useHitsterContext();
  return (
    <HitsterKaartjeBack {...props}>
      <div className="hitster_kaartje_hitster_content">
        Other players can try to steal the card now by picking one of the open
        spots on the timeline <br />
        <br />
        Or you can reveal the card
        <HitsterKaartjeButton
          icon={FaEye}
          onClick={() => hitsterContext.setGamePhase(gamePhases.REVEALED)}
        />
      </div>
    </HitsterKaartjeBack>
  );
};

const HitsterKaartjeRevealed = (props) => {
  const hitsterContext = useHitsterContext();
  return (
    <div
      className="hitster_kaartje_outer"
      style={{ backgroundColor: props.track.color }}
      onClick={() => hitsterContext.startNewRound()}
    >
      <div className="hitster_kaartje_revealed_text artist">
        <span className="truncate_text">{props.track.artists}</span>
      </div>
      <div className="hitster_kaartje_revealed_text year">
        {props.track.releaseYear}
      </div>
      <div className="hitster_kaartje_revealed_text title">
        <span className="truncate_text">{props.track.name}</span>
      </div>
    </div>
  );
};

const HitsterKaartjeTimeline = (props) => {
  return (
    <div
      className={"hitster_kaartje_outer in_timeline"}
      style={{ backgroundColor: props.track.color }}
    >
      <div className="hitster_kaartje_revealed_text in_timeline artist ">
        <span className="truncate_text">{props.track.artists}</span>
      </div>
      <div className="hitster_kaartje_revealed_text in_timeline year">
        {props.track.releaseYear}
      </div>
      <div className="hitster_kaartje_revealed_text in_timeline title">
        <span className="truncate_text">{props.track.name}</span>
      </div>
    </div>
  );
};

const HitsterKaartjeBack = (props) => {
  return (
    <div className="hitster_kaartje_outer back">
      <div className="hitster_kaartje_logo">BANGSTER</div>
      <div className="hitster_kaartje_content">{props.children}</div>
    </div>
  );
};

const HitsterKaartjeSongPlayer = (props) => {
  return (
    <HitsterKaartjeBack {...props}>
      <SpeakerPlayButton
        playing={props.playing}
        onPlayPause={props.onPlayPause}
      />
    </HitsterKaartjeBack>
  );
};

const HitsterKaartjePlayerList = (props) => {
  const hitsterContext = useHitsterContext();

  const effectivePlayers = hitsterContext.gameOverview.players.filter(
    (pl) => !props.playersToFilter.includes(pl.name)
  );

  console.log("effectivePlayers", effectivePlayers);

  return (
    <div className="hitster_kaartje_player_list">
      {effectivePlayers.map((player, index) => {
        // @ts-ignore
        return (
          <div
            key={index}
            className="hitster_kaartje_player"
            style={{
              color: player.color,
              textShadow:
                "0px 0px 0.1vw " + tinycolor(player.color).lighten(20),
            }}
            onClick={() => props.onSelectPlayer(player)}
          >
            <TbUserFilled />
            <div className="hitster_kaartje_player_name">{player.name}</div>
          </div>
        );
      })}
    </div>
  );
};

const HitsterKaartjePlayers = (props) => {
  const hitsterContext = useHitsterContext();

  let currentPlayer = hitsterContext.currentPlayer();
  const playersToFilter = [
    currentPlayer.name,
    ...hitsterContext.hitsterGuesses.map((g) => g.player),
  ];

  const onSelectPlayer = (player) =>
    hitsterContext.assignPlayerToGuess(player.name);
  return (
    <HitsterKaartjeBack {...props}>
      <div className="hitster_kaartje_player_list_outer">
        Who is trying to hitster?
        <HitsterKaartjePlayerList
          playersToFilter={playersToFilter}
          onSelectPlayer={onSelectPlayer}
        />
      </div>
    </HitsterKaartjeBack>
  );
};

const SpeakerPlayButton = (props) => {
  const noteContainerRef = useRef(null);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (!props.playing) return;

    const container = noteContainerRef.current;

    const interval = setInterval(() => {
      const note = document.createElement("span");
      note.className = "note_floating";
      // note.textContent = Math.random() > 0.5 ? "🎵" : "🎶";

      // Starting near center
      note.style.left = "50%";
      note.style.top = "50%";

      // Random direction
      const angle = Math.random() * 2 * Math.PI;
      const distance =
        screenWidth > 600 ? Math.random() * 10 + 6 : Math.random() * 22 + 15; // vw
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      const scale = Math.random() * 0.5 + 0.75;
      const rotate = Math.random() * 40 - 20;
      const duration = Math.random() * 1 + 2; // 2s–3s

      note.style.setProperty("--dx", `${dx}vw`);
      note.style.setProperty("--dy", `${dy}vw`);
      note.style.setProperty("--rotate", `${rotate}deg`);
      note.style.setProperty("--scale", scale.toString());
      note.style.animationDuration = `${duration}s`;

      container.appendChild(note);

      const Icon = Math.random() < 0.5 ? BsMusicNote : BsMusicNoteBeamed;

      ReactDOM.render(<Icon className="note_icon" />, note);

      setTimeout(() => note.remove(), duration * 1000);
    }, 400);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.playing]);

  return (
    <div
      className="speaker_play_button_outer"
      onClick={() => props.onPlayPause()}
    >
      <div ref={noteContainerRef} className="floating_notes_random" />
      <div className="speaker_play_button_inner1">
        <div className="speaker_play_button_inner2">
          <div
            className={`speaker_play_button_inner3 ${
              props.playing ? "pulsing" : ""
            }`}
          >
            <div className="speaker_play_button_inner4">
              <div className="speaker_play_button_inner5">
                {props.playing ? <FaPause /> : <FaPlay />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HitsterKaartje;
