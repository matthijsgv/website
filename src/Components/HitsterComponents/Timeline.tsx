import React, { useEffect, useState } from "react";
import HitsterKaartje from "./HitsterKaartje";
import "../../style/Components/HitsterComponents/Timeline.css";
import {
  TbTriangleInvertedFilled,
  TbUserFilled,
  TbCardsFilled,
} from "react-icons/tb";
import tinycolor from "tinycolor2";
import { useHitsterContext } from "../../store/hitster-context";
import { gamePhases, getGamePhaseIndex } from "./GamePhases";
import {
  HitsterTrack,
  Indicator,
  IndicatorProps,
  TimelineHeaderProps,
  TimelineProps,
} from "types/hitster-types";

const makeIndicatorArray = (timeline: HitsterTrack[]): Indicator[] => {
  let indicators = [];
  let lowerBound = 0;
  let upperBound = 9999;
  for (let i = 0; i < timeline.length; i++) {
    let indicator = { lowerBound: 0, upperBound: 9999, active: false };
    let year = +timeline[i].releaseYear;
    indicator.lowerBound = lowerBound;
    indicator.upperBound = year;
    lowerBound = year;
    indicators.push(indicator);
  }
  indicators.push({
    active: false,
    lowerBound: lowerBound,
    upperBound: upperBound,
  });
  return indicators;
};

const deactivateAllIndicators = (indicators: Indicator[]) => {
  return indicators.map((item) => ({ ...item, active: false }));
};

const Timeline = (props: TimelineProps) => {
  const hitsterCtx = useHitsterContext();

  const [indicators, setIndicators] = useState(() =>
    makeIndicatorArray(props.player.timeline)
  );

  useEffect(() => {
    if (hitsterCtx.gamePhase === gamePhases.LOCKED_IN) {
      if (hitsterCtx.lockedInGuess === null) {
        let idx = indicators.findIndex((item) => item.active);
        hitsterCtx.setLockedInGuess({
          index: idx,
          lowerBound: indicators[idx].lowerBound,
          upperBound: indicators[idx].upperBound,
        });
      }
      setIndicators((prev) => {
        return prev.map((i) => ({ ...i, active: false }));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitsterCtx.gamePhase]);

  const Indicator = (props: IndicatorProps) => {
    const hitsterGuess = hitsterCtx.hitsterGuesses.find(
      (item) => item.guess.index === props.index
    );

    const onClickIndicator = (index: number) => {
      const currentGamePhaseIdx = getGamePhaseIndex(hitsterCtx.gamePhase);
      const isBeforeLockedIn =
        currentGamePhaseIdx < getGamePhaseIndex(gamePhases.LOCKED_IN);
      const clickedIndicator = indicators[index];

      if (isBeforeLockedIn) {
        // Current guess is not yet locked in
        if (clickedIndicator.active) {
          // Clicked indicator is active and needs to be deactivated

          setIndicators((prevIndicators) => {
            let temp = [...prevIndicators];
            temp[index].active = false;
            return temp;
          });

          // No longer READY TO LOCK IN as no indicator is active
          hitsterCtx.setGamePhase(gamePhases.PLAYING);
        } else {
          // Clicked indicator is inactive and therefore the current guess of the player
          setIndicators((prevIndicators) => {
            let temp = [...prevIndicators];
            temp = deactivateAllIndicators(temp);
            temp[index].active = true;
            return temp;
          });
          // Player is ready to lock in guess
          hitsterCtx.setGamePhase(gamePhases.READY_TO_LOCK_IN);
        }
      } else {
        // Guess is already locked in
        if (clickedIndicator.active) {
          // If clicked indicator is active, nothing happens
          return;
        }
        if (hitsterCtx.gamePhase === gamePhases.LOCKED_IN) {
          // Set current indicator active
          setIndicators((prev) => {
            let temp = [...prev];
            temp = deactivateAllIndicators(temp);
            temp[index] = { ...temp[index], active: true };
            return temp;
          });

          // If the indicator is already guessed
          const alreadyGuessed = hitsterCtx.hitsterGuesses.find((i) => {
            return i.guess.index === index;
          });
          if (alreadyGuessed) {
            // Let the user remove it
            hitsterCtx.setPendingRemoval(alreadyGuessed.player);
            hitsterCtx.setGamePhase(gamePhases.REMOVING_HITSTER);
          } else {
            hitsterCtx.setGamePhase(gamePhases.TRYING_TO_HITSTER);
            hitsterCtx.setCurrentPendingHitster({
              index: index,
              lowerBound: clickedIndicator.lowerBound,
              upperBound: clickedIndicator.upperBound,
            });
          }
        }
        return;
      }
    };

    return (
      <div
        className="indicator"
        onClick={() => {
          onClickIndicator(props.index);
        }}
        // @ts-ignore
      >
        <TbTriangleInvertedFilled
          // @ts-ignore
          style={{
            color:
              hitsterCtx.lockedInGuess !== null
                ? hitsterCtx.lockedInGuess.index === props.index
                  ? hitsterCtx.currentPlayer().color
                  : hitsterGuess
                  ? hitsterGuess.color
                  : "white"
                : "white",
          }}
          className={`indicator_icon ${props.indicator.active ? "active" : ""}`}
        />
      </div>
    );
  };

  const TimelineHeader = (props: TimelineHeaderProps) => {
    const base = tinycolor(props.color);
    const light = base.lighten(8).toString();
    const dark = base.darken(14).toString();

    return (
      <div
        className="timeline_header"
        style={{
          backgroundColor: props.color,
          borderTopColor: light,
          borderBottomColor: dark,
        }}
      >
        <div className="timeline_header_side left">
          <TbUserFilled className="timeline_header_icon" /> {props.player}
        </div>

        <div className="timeline_header_side right">
          <TbCardsFilled className="timeline_header_icon" /> {props.numOfCards}
        </div>
      </div>
    );
  };

  const TimelineMessageBar = () => {
    const generateMessage = (): string => {
      const result = hitsterCtx.roundResult;
      if (result === null) return "";
      let message = "";
      if (result.playerCorrect) {
        message +=
          "Congrats " +
          hitsterCtx.currentPlayer().name +
          ", your guess was correct! The card will be added to your timeline. ";
        if (result.hitstersCorrect.length > 0) {
          if (result.hitstersCorrect.length > 1) {
            message +=
              result.hitstersCorrect[0] + " and " + result.hitstersCorrect[1];
          } else {
            message += result.hitstersCorrect[0];
          }
          message +=
            ", you'll get your coin back as your guess was also correct. ";
        }
      } else {
        message += "Wrong answer, " + hitsterCtx.currentPlayer().name + ". ";
        if (result.hitstersCorrect.length > 0) {
          message +=
            result.hitstersCorrect[0] +
            ", you succesfully stole this card. The card will be added to your timeline. ";
          if (result.hitstersCorrect.length > 1) {
            message +=
              result.hitstersCorrect[1] +
              " you will get your coin back, as you were also correct, but too slow. ";
          }
        } else {
          message += "No one will get this card. ";
        }
      }

      message += "Click the card to start the next round.";
      return message;
    };
    const message = generateMessage();

    const repeatedMessages = Array(20)
      .fill(message)
      .map((msg, i) => (
        <div key={Math.random().toString()}>
          <span key={Math.random().toString()} >{msg}</span>
          <span key={Math.random().toString()}>
            +&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+&nbsp;&nbsp;+
          </span>
      </div>
      ));

    return (
      <div className="timeline_reveal_message_bar">
        <div className="marquee">{repeatedMessages}</div>
      </div>
    );
  };

  return (
    <div className="timeline_outer">
      {hitsterCtx.gamePhase === gamePhases.REVEALED &&
        hitsterCtx.roundResult !== null && <TimelineMessageBar />}
      <TimelineHeader
        color={props.player.color}
        player={props.player.name}
        numOfCards={props.player.timeline.length}
      />
      <div className="timeline_row">
        <div className="timeline_scrollable_content">
          <div
            className={`indicator_row ${
              indicators.length === 1 && props.player.timeline.length === 0
                ? "center"
                : ""
            }`}
          >
            {indicators.map((item, index) => {
              return <Indicator key={Math.random().toString()} indicator={item} index={index} />;
            })}
          </div>
          <div className="card_row">
            {props.player.timeline.map((item) => {
              return (
                <HitsterKaartje
                  key={Math.random().toString()}
                  inTimeline={true}
                  revealed={true}
                  track={item}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
