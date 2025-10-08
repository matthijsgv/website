import React, { useState, useEffect } from "react";
import HitsterScreen from "./HitsterScreen";
import "../../style/Hitster/HitsterCreateGame.css";
import { useHitsterContext } from "store/hitster-context";
import { CreatePlayer } from "types/hitster-types";

interface HitsterCreateGameProps {}

interface HitsterCreatePlayerProps {
  index: number;
  player: CreatePlayer;
  setPlayers: React.Dispatch<React.SetStateAction<CreatePlayer[]>>;
  onPickColor: (col: string, index: number) => void;
}

const HitsterCreatePlayer = (props: HitsterCreatePlayerProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.player.name === "") {
      inputRef.current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="hitster_create_game_player">
      <div
        className="hitster_create_game_color_icon"
        style={{ backgroundColor: props.player.color }}
        onClick={() => props.onPickColor(props.player.color, props.index)}
      ></div>
      <input
        ref={inputRef}
        value={props.player.name}
        onChange={(e) => {
          props.setPlayers((prev) => {
            const temp = [...prev];
            temp[props.index] = { ...temp[props.index], name: e.target.value };
            return temp;
          });
        }}
      />
    </div>
  );
};

interface ColorPickerModalProps {
  players: CreatePlayer[];
  curColor: string | null;
  curPlayerIndex: number | null;
  setCurColor: (col: string) => void;
  setPlayers: React.Dispatch<React.SetStateAction<CreatePlayer[]>>;
  onCloseModal: () => void;
}

const ColorPickerModal = (props: ColorPickerModalProps) => {
  const hitsterContext = useHitsterContext();

  const ColorSquare = ({
    color,
    curColor,
  }: {
    color: string;
    curColor: string | null;
  }) => {
    const { players, curPlayerIndex } = props;
    const currentPlayerColor =
      curPlayerIndex !== null ? players[curPlayerIndex].color : null;

    const isUsedByAnotherPlayer = players.some(
      (pl, idx) => idx !== curPlayerIndex && pl.color === color
    );

    const isCurrentColor = color === currentPlayerColor;

    const handleClick = () => {
      if (isUsedByAnotherPlayer || isCurrentColor || curPlayerIndex === null)
        return;

      props.setPlayers((prev) => {
        const temp = [...prev];
        temp[curPlayerIndex] = {
          ...temp[curPlayerIndex],
          color,
        };
        return temp;
      });

      props.setCurColor(color);
      props.onCloseModal();
    };

    return (
      <div
        className="color_square"
        style={{
          backgroundColor: color,
          opacity: isUsedByAnotherPlayer && !isCurrentColor ? 0.2 : 1,
          cursor:
            isUsedByAnotherPlayer && !isCurrentColor
              ? "not-allowed"
              : "pointer",
          border: isCurrentColor ? "3px solid white" : "none",
          boxSizing: "border-box",
        }}
        onClick={handleClick}
      />
    );
  };

  return (
    <div className="color_picker_modal">
      <div className="color_picker_overlay" onClick={props.onCloseModal} />
      <div className="color_picker_content">
        <div className="color_picker_title">Pick a color</div>
        <div className="color_squares_grid">
          {Object.values(hitsterContext.playerColors).map((col) => (
            <ColorSquare key={col} color={col} curColor={props.curColor} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HitsterCreateGame = (props: HitsterCreateGameProps) => {
  const hitsterContext = useHitsterContext();

  const [players, setPlayers] = useState<CreatePlayer[]>([
    { name: "", color: hitsterContext.playerColors.orange },
  ]);

  const [curColor, setCurColor] = useState<string | null>(null);
  const [curPlayerIndex, setCurPlayerIndex] = useState<number | null>(null);
  const [colorPickerModalVisible, setColorPickerModalVisible] = useState(false);

  const onPickColor = (curColor: string, index: number) => {
    setCurColor(curColor);
    setCurPlayerIndex(index);
    setColorPickerModalVisible(true);
  };

  const onCloseModal = () => {
    setColorPickerModalVisible(false);
  };

  return (
    <HitsterScreen>
      <div className="hitster_create_game_outer">
        {colorPickerModalVisible && (
          <ColorPickerModal
            players={players}
            curColor={curColor}
            curPlayerIndex={curPlayerIndex}
            onCloseModal={onCloseModal}
            setCurColor={setCurColor}
            setPlayers={setPlayers}
          />
        )}

        <div className="hitster_create_game_player_list">
          <div className="hitster_create_game_title">
            Add all players for your game
          </div>
          {players.map((player, idx) => (
            <HitsterCreatePlayer
              key={idx}
              index={idx}
              player={player}
              setPlayers={setPlayers}
              onPickColor={onPickColor}
            />
          ))}
          {players.length < 8 && (
            <div
              className="hitster_create_game_add_player"
              onClick={() => {
                const usedColors = players.map((p) => p.color);
                const availableColors = Object.values(
                  hitsterContext.playerColors
                ).filter((col) => !usedColors.includes(col));
                const newColor = availableColors[0] || "#cccccc";
                setPlayers((prev) => [...prev, { name: "", color: newColor }]);
              }}
            >
              +
            </div>
          )}
        </div>
        <div className="hitster_create_game_start_button_outer">
          <div
            className="hitster_create_game_start_button_button"
            onClick={() => hitsterContext.startGame(players)}
          >
            Start game
          </div>
        </div>
      </div>
    </HitsterScreen>
  );
};

export default HitsterCreateGame;
