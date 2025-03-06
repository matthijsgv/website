import React from 'react';
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { GiHearts, GiClubs, GiSpades, GiDiamonds } from "react-icons/gi";
import back from "../images/card_back.png";

const suitsMap = {
  hearts: { color: "red", icon: <GiHearts /> },
  clubs: { color: "black", icon: <GiClubs /> },
  diamonds: { color: "red", icon: <GiDiamonds /> },
  spades: { color: "black", icon: <GiSpades /> },
};

const Corner = ({ card, side }) => (
  <div className={`suit_face_corner ${side}`}>
    <p>{card.face}</p>
    <div>{suitsMap[card.suit].icon}</div>
  </div>
);

const PlayingCard = ({
  card,
  index,
  position,
  setPosition,
  onDragStop,
  moveToFront,
  zIndex,
  isPlayCard = false,
  isDealCard = false,
  isAflegCard = false,
  disabled = false,
  autoDrop = (card, isDealCard, isPlayCard) => {},
  pileIndex = null,
}) => {
  const [localPosition, setLocalPosition] = useState(
    position || { x: 0, y: 0 }
  );
  const [localZIndex, setLocalZIndex] = useState(zIndex || 1);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  useEffect(() => {
    setLocalZIndex(zIndex);
  }, [zIndex]);

  const handleDrag = (e, newPosition) => {
    if (isPlayCard) {
      setPosition(newPosition, index);
      setLocalPosition(newPosition);
    } else {
      setLocalPosition(newPosition);
    }
    if (moveToFront) {
      moveToFront(index);
    } else {
      setLocalZIndex(1000);
    }
  };

  const handleStop = (e, data) => {
    if (!isDragging) {
      autoDrop(card, isDealCard, isPlayCard, pileIndex);
    }
    clearTimeout(dragRef.current);
    dragRef.current = null;
    setIsDragging(false);

    const cardRect = e.target.getBoundingClientRect();
    let onDragStopAction = false;

    if (isPlayCard) onDragStopAction = onDragStop(e, data, index, cardRect);
    if (isDealCard) onDragStopAction = onDragStop(card, cardRect);
    if (onDragStopAction) return;

    setLocalPosition({ x: 0, y: 0 });
    setLocalZIndex(1);
  };

  const cardStyle = {
    zIndex: localZIndex,
    ...(isDealCard && { left: `${index * 1.4}vw` }),
    ...(isAflegCard && { top: "-2px", left: "-2px" }),
    ...(isPlayCard && { top: `${index * 2}vw` }),
  };

  return (
    <Draggable
      position={localPosition}
      onStart={() => {
        dragRef.current = setTimeout(() => {
          setIsDragging(true);
        }, 100);
      }}
      onDrag={handleDrag}
      onStop={handleStop}
      disabled={disabled || (!card.faceUp && !isDealCard && !isAflegCard)}
    >
      <div
        className={`playing_card ${suitsMap[card.suit].color}`}
        style={cardStyle}
      >
        {card.faceUp || isDealCard || isAflegCard ? (
          <>
            <Corner card={card} side="top" />
            <div className="centered_logo suit_middle">
              {suitsMap[card.suit].icon}
            </div>
            <Corner card={card} side="bottom" />
          </>
        ) : (
          <img draggable={false} className="card_back" src={back} alt="back" />
        )}
      </div>
    </Draggable>
  );
};

export default PlayingCard;
