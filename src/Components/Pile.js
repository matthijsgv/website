import React from 'react';
import { useState, useCallback, useEffect } from "react";
import PlayingCard from "./PlayingCard"; // Ensure this import path is correct

const Pile = ({ pile, index: pileIndex, onDragStop, autoDrop }) => {
  const [zIndices, setZIndices] = useState(pile.map(() => 1));

    const [positions, setPositions] = useState(pile.map(() => { return { x: 0, y: 0 } }));

    useEffect(() => {
        setZIndices(pile.map(() => 1));
        setPositions(pile.map(() => { return { x: 0, y: 0 } }));
    }, [pile]);

    const setPosition = (newPosition, cardIndex) => {
        setPositions(state => {
            let temp = [...state];
            for (let i = cardIndex; i < pile.length; i++){
                temp[i] = newPosition;
            }
            return temp;
        })
    }

  const moveToFront = useCallback((cardIndex) => {
    setZIndices((prevIndices) => {
      const newIndices = [...prevIndices];
      for (let i = cardIndex; i < newIndices.length; i++) {
        newIndices[i] = 100;
      }
      return newIndices;
    });
  }, []);

  const handleDragStop = useCallback(
    (e, data, cardIndex, cardRect) => {
          const result = onDragStop(pileIndex, cardRect, cardIndex);
          if (!result) {
              setPosition(
                  {x:0,y:0}, cardIndex
              );
          }
      if (!result) {
        setZIndices((prevIndices) => prevIndices.map(() => 1));
      }
      return result;
    },
    // eslint-disable-next-line
    [onDragStop, pileIndex]
  );


  return (
    <>
      {pile.map((card, cardIndex) => (
        <PlayingCard
          key={`${card.suit}-${card.face}-${cardIndex}`}
          card={card}
          index={cardIndex}
          setPosition={setPosition}
          position={positions[cardIndex]}
          onDragStop={handleDragStop}
          moveToFront={moveToFront}
          zIndex={zIndices[cardIndex]}
          isPlayCard={true}
          autoDrop={autoDrop}
          pileIndex={pileIndex}
        />
      ))}
    </>
  );
};

export default React.memo(Pile);
