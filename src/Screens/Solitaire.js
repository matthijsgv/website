import "../style/Solitaire.css";

import Draggable from "react-draggable";
import { GiHearts, GiClubs, GiSpades, GiDiamonds } from "react-icons/gi";
import back from "../images/card_back.png";
import { useEffect, useState, useRef } from "react";
import { TbReload } from "react-icons/tb";

// Fisher-Yates Shuffle Algorithm
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
  }
  return deck;
}

function dealCards(deck) {
  const piles = [[], [], [], [], [], [], []];
  let deckIndex = 0;
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j <= i; j++) {
      const card = deck[deckIndex];
      card.faceUp = j === i; // Only the top card in each pile is face-up
      piles[i].push(card);
      deckIndex++;
    }
  }
  return { startPiles: piles, startRemainingDeck: deck.slice(deckIndex) };
}

const suitsMap = {
  hearts: {
    color: "red",
    icon: <GiHearts />,
  },
  clubs: { color: "black", icon: <GiClubs /> },
  diamonds: { color: "red", icon: <GiDiamonds /> },
  spades: { color: "black", icon: <GiSpades /> },
};

const inPile = (pileDims, cardDims) => {
  return (
    pileDims.top < cardDims.bottom &&
    pileDims.bottom > cardDims.top &&
    pileDims.left < cardDims.right &&
    pileDims.right > cardDims.left
  );
};

const Solitaire = (props) => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const colors = {
    hearts: "red",
    diamonds: "red",
    clubs: "black",
    spades: "black",
  };
  const faces = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const cards = [];
  const pileRefs = useRef([]);
  const aflegRefs = useRef([]);

  suits.forEach((suit) => {
    faces.forEach((face) => {
      cards.push({ suit: suit, face: face });
    });
  });

  const [piles, setPiles] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [dealedCards, setDealedCards] = useState([]);
  const [aflegStapels, setAflegStapels] = useState(() => {
    let temp = {};
    suits.forEach((s) => (temp[s] = []));
    return temp;
  });

  const dealThreeCards = () => {
    setRemainingDeck((remainingDeckState) => {
      let tempRemaining = [...remainingDeckState];
      let toDeal = tempRemaining.slice(0, 3);
      setDealedCards((dealedCardsState) => {
        let tempDeal = [...dealedCardsState];
        tempDeal = tempDeal.concat(toDeal);
        return tempDeal;
      });
      return tempRemaining.slice(3);
    });
  };

  useEffect(() => {
    const deck = shuffleDeck(cards);
    const { startPiles, startRemainingDeck } = dealCards(deck);
    setPiles(startPiles);
    setRemainingDeck(startRemainingDeck);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("Afleg", aflegStapels);
  }, [aflegStapels]);

  const moveFromPileToPile = (from, to, fromIndex) => {
    setPiles((state) => {
      let temp = [...state];
      let tempFrom = [...temp[from]];
      let tempToMove = tempFrom.slice(fromIndex);
      tempFrom = tempFrom.slice(0, fromIndex);
      if (tempFrom.length > 0) {
        tempFrom[tempFrom.length - 1].faceUp = true;
      }
      temp[from] = tempFrom;
      let tempTo = [...temp[to]];
      tempTo = tempTo.concat(tempToMove);
      temp[to] = tempTo;
      return temp;
    });
  };

  const onDragStopCheckPiles = (curPile, cardDims, cardIndex) => {
    const card = piles[curPile][cardIndex];
    const topCardOfPile = cardIndex === piles[curPile].length - 1;
    if (topCardOfPile) {
      const afleg = checkAfleg(cardDims, card);
      if (afleg) {
        console.log("Afleg");
        setPiles((state) => {
          let temp = [...state];
          temp[curPile] = temp[curPile].slice(0, temp[curPile].length - 1);
          if (temp[curPile].length > 0) {
            temp[curPile][temp[curPile].length - 1].faceUp = true;
          }
          return temp;
        });
      }
    }

    for (let i = 0; i < 7; i++) {
      if (i === curPile) continue;
      const inThisOne = inPile(
        pileRefs.current[i].getBoundingClientRect(),
        cardDims
      );
      if (inThisOne) {
        const allowedToDropBool = allowedToDrop(
          piles[i][piles[i].length - 1] || null,
          piles[curPile][cardIndex]
        );
        if (allowedToDropBool) {
          moveFromPileToPile(curPile, i, cardIndex);
          break;
        }
      }
    }
  };

  const addCardToAflegstapel = (card, suit) => {
    setAflegStapels((state) => {
      let temp = { ...state };
      temp[suit] = [...temp[suit], card];
      return temp;
    });
  };

  const dealedCardAddtoPile = (card, cardDims) => {
    const afleg = checkAfleg(cardDims, card);
    if (afleg) {
      setDealedCards((state) => {
        let temp = [...state];
        temp = temp.slice(0, temp.length - 1);
        return temp;
      });
      return;
    }

    for (let i = 0; i < 7; i++) {
      const inThisOne = inPile(
        pileRefs.current[i].getBoundingClientRect(),
        cardDims
      );
      if (inThisOne) {
        const allowed = allowedToDrop(
          piles[i][piles[i].length - 1] || null,
          dealedCards[dealedCards.length - 1]
        );
        if (allowed) {
          console.log("entering");
          const newPiles = [...piles];
          const newDealedCards = [...dealedCards];
          const toDeal = newDealedCards.pop(); // Remove the last card from dealedCards
          toDeal.faceUp = true;
          newPiles[i] = [...newPiles[i], toDeal]; // Add the card to the correct pile

          setPiles(newPiles); // Update the piles state
          setDealedCards(newDealedCards); // Update the dealedCards state
        }
        break;
      }
    }
  };

  const checkAfleg = (cardDims, card) => {
    for (let i = 0; i < 4; i++) {
      const inThisOne = inPile(
        aflegRefs.current[i].getBoundingClientRect(),
        cardDims
      );
      if (inThisOne) {
        const allowed = allowedToAfleg(card, suits[i]);
        if (allowed) {
          addCardToAflegstapel(card, suits[i]);
          return true;
        }
      }
    }
    return false;
  };

  const allowedToAfleg = (card, suit) => {
    if (card.suit !== suit) return false;
    if (aflegStapels[suit].length === 0) return card.face === "A";
    const lastAflegIndex = faces.findIndex(
      (x) => x === aflegStapels[suit][aflegStapels[suit].length - 1].face
    );
    const faceIndex = faces.findIndex((x) => x === card.face);
    if (faceIndex - lastAflegIndex === 1) return true;

    return false;
  };

  const allowedToDrop = (topCard, toDrop) => {
    if (topCard === null) {
      return toDrop.face === "K";
    }
    const topCardI = faces.findIndex((x) => x === topCard.face);
    const toDropI = faces.findIndex((x) => x === toDrop.face);

    return (
      topCardI - toDropI === 1 && colors[topCard.suit] !== colors[toDrop.suit]
    );
  };

  return (
    <div className="solitaire_outer">
      <div className="solitaire_top_bar">
        <div className="solitair_deck_and_deal">
          <div
            className="deck"
            onClick={() => {
              if (remainingDeck.length > 0) dealThreeCards();
              else {
                setRemainingDeck(dealedCards);
                setDealedCards([]);
              }
            }}
          >
            {remainingDeck.length > 0 ? (
              <img
                draggable={false}
                className="card_back"
                src={back}
                alt="back"
              ></img>
            ) : (
              <div className="centered_logo">
                <TbReload />
              </div>
            )}
          </div>
          <div className="deal">
            {dealedCards.length > 0 &&
              dealedCards
                .slice(dealedCards.length - Math.min(dealedCards.length, 3))
                .map((c, i) => {
                  return (
                    <PlayingCardDeal
                      index={i}
                      suit={c.suit}
                      face={c.face}
                      onDragStop={dealedCardAddtoPile}
                      disabled={Math.min(dealedCards.length, 3) - 1 !== i}
                    />
                  );
                })}
          </div>
        </div>
        <div className="solitaire_aflegstapels">
          {suits.map((suit, index) => {
            return (
              <AflegStapel
                index={index}
                aflegRefs={aflegRefs}
                suit={suit}
                stapel={aflegStapels[suit]}
              />
            );
          })}
        </div>
      </div>
      <div className="solitaire_piles">
        {piles.map((pile, index) => {
          return (
            <div
              style={{ height: `${8.8 + (pile.length - 1) * 2}vw` }}
              className="pile"
              ref={(el) => (pileRefs.current[index] = el)}
            >
              <Pile
                index={index}
                onDragStop={onDragStopCheckPiles}
                pile={pile}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AflegStapel = (props) => {
  return (
    <div
      className="solitaire_stapel"
      ref={(el) => (props.aflegRefs.current[props.index] = el)}
    >
      {props.stapel.length === 0 && (
        <div className="centered_logo suit">
          {props.suit === "hearts" && <GiHearts />}
          {props.suit === "diamonds" && <GiDiamonds />}
          {props.suit === "clubs" && <GiClubs />}
          {props.suit === "spades" && <GiSpades />}
        </div>
      )}
      {props.stapel.map((x) => {
        return <AflegCard face={x.face} suit={x.suit} />;
      })}
    </div>
  );
};

const Pile = (props) => {
  const [positions, setPositions] = useState([]);

  const [zIndices, setZIndices] = useState(props.pile.map(() => 1));

  const moveToFront = (index) => {
    setZIndices((state) => {
      let temp = [...state];
      for (let i = index; i < state.length; i++) {
        temp[i] = 100;
      }
      return temp;
    });
  };

  useEffect(() => {
    setPositions(
      props.pile.map((x) => {
        return { x: 0, y: 0 };
      })
    );
    setZIndices(props.pile.map(() => 1));
  }, [props.pile]);

  const onDragStop = (e, data, index) => {
    const cardRect = e.target.getBoundingClientRect();
    props.onDragStop(props.index, cardRect, index);
    setPosition({ x: 0, y: 0 }, index);
    setZIndices((state) => state.map((x) => 1));
  };

  const setPosition = (newPos, idx) => {
    setPositions((state) => {
      let temp = [...state];
      for (let i = idx; i < state.length; i++) {
        temp[i] = newPos;
      }
      return temp;
    });
  };

  return (
    <>
      {props.pile.map((card, idx) => {
        return (
          <PlayingCard
            suit={card.suit}
            face={card.face}
            shown={card.faceUp}
            index={idx}
            position={positions[idx]}
            setPosition={setPosition}
            onDragStop={onDragStop}
            moveToFront={moveToFront}
            zIndex={zIndices[idx]}
          />
        );
      })}
    </>
  );
};

const Corner = (props) => {
  return (
    <div className={"suit_face_corner " + props.side}>
      <p>{props.face}</p>
      <div>{suitsMap[props.suit].icon}</div>
    </div>
  );
};

const PlayingCard = (props) => {
  return (
    <>
      <Draggable
        position={props.position}
        disabled={!props.shown}
        onDrag={(e, position) => {
          props.setPosition(position, props.index);
          props.moveToFront(props.index);
        }}
        onStop={(e, data) => props.onDragStop(e, data, props.index)}
      >
        <div
          className={`playing_card ${suitsMap[props.suit].color}`}
          style={{ top: `${props.index * 2}vw`, zIndex: props.zIndex }}
        >
          {props.shown && (
            <>
              <Corner {...props} side="top" />
              <div className="centered_logo suit_middle">
                {suitsMap[props.suit].icon}
              </div>
              <Corner {...props} side="bottom" />
            </>
          )}
          {!props.shown && (
            <img
              draggable={false}
              className="card_back"
              src={back}
              alt="back"
            ></img>
          )}
        </div>
      </Draggable>
    </>
  );
};

const PlayingCardDeal = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(1);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500); // Match the duration of the CSS animation
    return () => clearTimeout(timer);
  }, [props.face, props.suit]);

  return (
    <>
      <Draggable
        position={position}
        onDrag={(e, pos) => setPosition(pos)}
        onStart={() => setZIndex(1000)}
        onStop={(e, data) => {
          const cardRect = e.target.getBoundingClientRect();
          props.onDragStop({ face: props.face, suit: props.suit }, cardRect);
          setPosition({ x: 0, y: 0 });
          setZIndex(1);
        }}
        disabled={props.disabled}
      >
        <div
          className={`playing_card ${suitsMap[props.suit].color} ${
            animate ? "deal-animation" : ""
          }`}
          style={{ left: `${props.index * 1.4}vw`, zIndex: zIndex }}
        >
          <>
            <Corner {...props} side="top" />
            <div className="centered_logo suit_middle">
              {suitsMap[props.suit].icon}
            </div>
            <Corner {...props} side="bottom" />
          </>
        </div>
      </Draggable>
    </>
  );
};

const AflegCard = (props) => {
  const [zIndex, setZIndex] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <Draggable
      position={position}
      onDrag={(e, data) => setPosition(data)}
      onStart={() => {
        setZIndex(1000);
      }}
      onStop={() => {
        setPosition({ x: 0, y: 0 });
        setZIndex(1);
      }}
    >
      <div
        className={`playing_card ${suitsMap[props.suit].color}`}
        style={{ zIndex: zIndex }}
      >
        <>
          <Corner {...props} side="top" />
          <div className="centered_logo suit_middle">
            {suitsMap[props.suit].icon}
          </div>
          <Corner {...props} side="bottom" />
        </>
      </div>
    </Draggable>
  );
};

export default Solitaire;
