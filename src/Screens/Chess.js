import "../style/Chess.css";
import {
  FaChessBishop,
  FaChessKing,
  FaChessKnight,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Game} from "js-chess-engine";

const Chess = () => {
  // eslint-disable-next-line
  const [game, setGame] = useState(new Game());
  const cols = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const rows = [8, 7, 6, 5, 4, 3, 2, 1];

  // game.printToConsole();
  const setStartingBoard = () => {
    let chessboard = new Array(8);
    for (let i = 0; i < chessboard.length; i++) {
      chessboard[i] = new Array(8);
    }

    for (let i = 0; i < chessboard.length; i++) {
      for (let j = 0; j < chessboard.length; j++) {
        if (i % 2 === 0) {
          if (j % 2 === 0) {
            chessboard[i][j] = {
              color: "w",

              piece: {
                color: null,
                type: null,
              },
              field: cols[j] + rows[i].toString(),
            };
          } else {
            chessboard[i][j] = {
              color: "b",

              piece: {
                color: null,
                type: null,
              },
              field: cols[j] + rows[i].toString(),
            };
          }
        } else {
          if (j % 2 === 0) {
            chessboard[i][j] = {
              color: "b",

              piece: {
                color: null,
                type: null,
              },
              field: cols[j] + rows[i].toString(),
            };
          } else {
            chessboard[i][j] = {
              color: "w",

              piece: {
                color: null,
                type: null,
              },
              field: cols[j] + rows[i].toString(),
            };
          }
        }
      }
    }
    chessboard[0][0].piece = { color: "black", type: "rook" };
    chessboard[0][1].piece = { color: "black", type: "knight" };
    chessboard[0][2].piece = { color: "black", type: "bishop" };
    chessboard[0][3].piece = { color: "black", type: "queen" };
    chessboard[0][4].piece = { color: "black", type: "king" };
    chessboard[0][5].piece = { color: "black", type: "bishop" };
    chessboard[0][6].piece = { color: "black", type: "knight" };
    chessboard[0][7].piece = { color: "black", type: "rook" };
    chessboard[1][0].piece = { color: "black", type: "pawn" };
    chessboard[1][1].piece = { color: "black", type: "pawn" };
    chessboard[1][2].piece = { color: "black", type: "pawn" };
    chessboard[1][3].piece = { color: "black", type: "pawn" };
    chessboard[1][4].piece = { color: "black", type: "pawn" };
    chessboard[1][5].piece = { color: "black", type: "pawn" };
    chessboard[1][6].piece = { color: "black", type: "pawn" };
    chessboard[1][7].piece = { color: "black", type: "pawn" };

    chessboard[7][0].piece = { color: "white", type: "rook" };
    chessboard[7][1].piece = { color: "white", type: "knight" };
    chessboard[7][2].piece = { color: "white", type: "bishop" };
    chessboard[7][3].piece = { color: "white", type: "queen" };
    chessboard[7][4].piece = { color: "white", type: "king" };
    chessboard[7][5].piece = { color: "white", type: "bishop" };
    chessboard[7][6].piece = { color: "white", type: "knight" };
    chessboard[7][7].piece = { color: "white", type: "rook" };
    chessboard[6][0].piece = { color: "white", type: "pawn" };
    chessboard[6][1].piece = { color: "white", type: "pawn" };
    chessboard[6][2].piece = { color: "white", type: "pawn" };
    chessboard[6][3].piece = { color: "white", type: "pawn" };
    chessboard[6][4].piece = { color: "white", type: "pawn" };
    chessboard[6][5].piece = { color: "white", type: "pawn" };
    chessboard[6][6].piece = { color: "white", type: "pawn" };
    chessboard[6][7].piece = { color: "white", type: "pawn" };

    return chessboard;
  };

  const [chessboard, setChessboard] = useState(setStartingBoard());
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMovesOfSelected, setPossibleMovesOfSelected] = useState([]);
  // eslint-disable-next-line
  const [aiColor, setAiColor] = useState("black");
  // eslint-disable-next-line
  const [aiLevel, setAiLevel] = useState(0);

  const processAIMove = (move) => {
    const from = Object.keys(move)[0];
    const to = move[from];
    const fromX = rows.findIndex((x) => x === parseInt(from.charAt(1)));
    const fromY = cols.findIndex((x) => x === from.charAt(0));
    const toX = rows.findIndex((x) => x === parseInt(to.charAt(1)));
    const toY = cols.findIndex((x) => x === to.charAt(0));
    setChessboard((state) => {
      let tempState = [...state];
      let piece = tempState[fromX][fromY].piece;
      tempState[fromX][fromY].piece = { color: null, type: null };
      tempState[toX][toY].piece = piece;
      return tempState;
    });

    setSelectedPiece(null);
    setPossibleMovesOfSelected([]);
    setCurrentPlayer((state) => (state === "white" ? "black" : "white"));
  };

  const movePossible = (color, row, col) => {
    return (
      row >= 0 &&
      col >= 0 &&
      row < 8 &&
      col < 8 &&
      (chessboard[row][col].piece.type === null ||
        chessboard[row][col].piece.color !== color)
    );
  };
  const calculatePossibleMoves = (piece, row, col) => {
    let moves = [];
    if (piece.type === "pawn") {
      if (currentPlayer === "white") {
        if (
          movePossible(piece.color, row - 1, col) &&
          chessboard[row - 1][col].piece.color === null
        ) {
          moves.push({ row: row - 1, col: col });
        }
        if (
          row === 6 &&
          movePossible(piece.color, row - 2, col) &&
          chessboard[row - 2][col].piece.color === null
        ) {
          moves.push({ row: row - 2, col: col });
        }
        if (
          movePossible(piece.color, row - 1, col - 1) &&
          chessboard[row - 1][col - 1].piece.color === "black"
        ) {
          moves.push({ row: row - 1, col: col - 1 });
        }
        if (
          movePossible(piece.color, row - 1, col + 1) &&
          chessboard[row - 1][col + 1].piece.color === "black"
        ) {
          moves.push({ row: row - 1, col: col + 1 });
        }
      }
      if (currentPlayer === "black") {
        if (
          movePossible(piece.color, row + 1, col) &&
          chessboard[row + 1][col].piece.color === null
        ) {
          moves.push({ row: row + 1, col: col });
        }
        if (
          row === 1 &&
          movePossible(piece.color, row + 2, col) &&
          chessboard[row + 2][col].piece.color === null
        ) {
          moves.push({ row: row + 2, col: col });
        }
        if (
          movePossible(piece.color, row + 1, col - 1) &&
          chessboard[row + 1][col - 1].piece.color === "white"
        ) {
          moves.push({ row: row + 1, col: col - 1 });
        }
        if (
          movePossible(piece.color, row + 1, col + 1) &&
          chessboard[row + 1][col + 1].piece.color === "white"
        ) {
          moves.push({ row: row + 1, col: col + 1 });
        }
      }
    }
    if (piece.type === "knight") {
      if (movePossible(piece.color, row + 2, col + 1)) {
        moves.push({ row: row + 2, col: col + 1 });
      }
      if (movePossible(piece.color, row + 2, col - 1)) {
        moves.push({ row: row + 2, col: col - 1 });
      }
      if (movePossible(piece.color, row - 2, col + 1)) {
        moves.push({ row: row - 2, col: col + 1 });
      }
      if (movePossible(piece.color, row - 2, col - 1)) {
        moves.push({ row: row - 2, col: col - 1 });
      }
      if (movePossible(piece.color, row + 1, col + 2)) {
        moves.push({ row: row + 1, col: col + 2 });
      }
      if (movePossible(piece.color, row + 1, col - 2)) {
        moves.push({ row: row + 1, col: col - 2 });
      }
      if (movePossible(piece.color, row - 1, col + 2)) {
        moves.push({ row: row - 1, col: col + 2 });
      }
      if (movePossible(piece.color, row - 1, col - 2)) {
        moves.push({ row: row - 1, col: col - 2 });
      }
    }

    if (piece.type === "bishop") {
      let stopCondition = false;
      let x = row;
      let y = col;
      while (movePossible(piece.color, x + 1, y + 1) && !stopCondition) {
        x += 1;
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y + 1) && !stopCondition) {
        x -= 1;
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x + 1, y - 1) && !stopCondition) {
        x += 1;
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y - 1) && !stopCondition) {
        x -= 1;
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
    }
    if (piece.type === "rook") {
      let stopCondition = false;
      let x = row;
      let y = col;
      while (movePossible(piece.color, x + 1, y) && !stopCondition) {
        x += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y) && !stopCondition) {
        x -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x, y + 1) && !stopCondition) {
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x, y - 1) && !stopCondition) {
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
    }
    if (piece.type === "queen") {
      let stopCondition = false;
      let x = row;
      let y = col;
      while (movePossible(piece.color, x + 1, y + 1) && !stopCondition) {
        x += 1;
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y + 1) && !stopCondition) {
        x -= 1;
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x + 1, y - 1) && !stopCondition) {
        x += 1;
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y - 1) && !stopCondition) {
        x -= 1;
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x + 1, y) && !stopCondition) {
        x += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x - 1, y) && !stopCondition) {
        x -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x, y + 1) && !stopCondition) {
        y += 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
      stopCondition = false;
      x = row;
      y = col;
      while (movePossible(piece.color, x, y - 1) && !stopCondition) {
        y -= 1;
        if (
          chessboard[x][y].piece.color !== null &&
          chessboard[x][y].piece.color !== piece.color
        ) {
          stopCondition = true;
        }
        moves.push({ row: x, col: y });
      }
    }

    if (piece.type === "king") {
      if (movePossible(piece.color, row + 1, col)) {
        moves.push({ row: row + 1, col: col });
      }
      if (movePossible(piece.color, row - 1, col)) {
        moves.push({ row: row - 1, col: col });
      }
      if (movePossible(piece.color, row + 1, col + 1)) {
        moves.push({ row: row + 1, col: col + 1 });
      }
      if (movePossible(piece.color, row + 1, col - 1)) {
        moves.push({ row: row + 1, col: col - 1 });
      }
      if (movePossible(piece.color, row - 1, col + 1)) {
        moves.push({ row: row - 1, col: col + 1 });
      }
      if (movePossible(piece.color, row - 1, col - 1)) {
        moves.push({ row: row - 1, col: col - 1 });
      }
      if (movePossible(piece.color, row, col + 1)) {
        moves.push({ row: row, col: col + 1 });
      }
      if (movePossible(piece.color, row, col - 1)) {
        moves.push({ row: row, col: col - 1 });
      }
    }

    setPossibleMovesOfSelected(moves);
  };

  const makeMove = (x, y, oldField, newField) => {
    setChessboard((state) => {
      let tempState = [...state];
      let tempRowSelected = [...tempState[x]];
      tempRowSelected[y] = {
        ...tempRowSelected[y],
        piece: tempState[selectedPiece.x][selectedPiece.y].piece,
      };

      tempState[x] = tempRowSelected;
      tempState[selectedPiece.x][selectedPiece.y].piece = {
        color: null,
        type: null,
      };
      return tempState;
    });
    game.move(oldField, newField);
    setSelectedPiece(null);
    setPossibleMovesOfSelected([]);
    setCurrentPlayer((state) => (state === "white" ? "black" : "white"));
  };

  useEffect(() => {
    if (currentPlayer === aiColor) {
      setTimeout(() => {
        const aimove = game.aiMove(aiLevel);
        processAIMove(aimove);
      }, 1000);
    }
    // eslint-disable-next-line
  }, [currentPlayer]);

  const handleClick = (current, x, y) => {
    if (
      selectedPiece !== null &&
      possibleMovesOfSelected.findIndex(
        (item) => item.row === x && item.col === y
      ) >= 0
    ) {
      makeMove(x, y, selectedPiece.field, current.field);
    }
    if (
      selectedPiece !== null &&
      selectedPiece.x === x &&
      selectedPiece.y === y
    ) {
      setSelectedPiece(null);
      setPossibleMovesOfSelected([]);
      return;
    }
    if (current.piece.color === null || current.piece.color !== currentPlayer) {
      setSelectedPiece(null);
      setPossibleMovesOfSelected([]);
      return;
    }

    setSelectedPiece({ x: x, y: y, field: current.field });

    calculatePossibleMoves(current.piece, x, y);
  };


  const printPiece = (piece) => {
    if (piece.type === null) return;

    if (piece.type === "rook")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessRook color={piece.color} />{" "}
        </div>
      );
    if (piece.type === "knight")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessKnight color={piece.color} />
        </div>
      );
    if (piece.type === "bishop")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessBishop color={piece.color} />
        </div>
      );
    if (piece.type === "queen")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessQueen color={piece.color} />
        </div>
      );
    if (piece.type === "king")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessKing color={piece.color} />
        </div>
      );
    if (piece.type === "pawn")
      return (
        <div className="chess_piece" color={piece.color}>
          <FaChessPawn color={piece.color} />
        </div>
      );
  };

  return (
    <div className="chess_outer">
      <div className="chess_board">
        {chessboard.map((row, row_idx) => {
          return row.map((col, col_idx) => {
            return (
              <div
                value={chessboard[row_idx][col_idx].color}
                className="chess_field"
                onClick={() => {
                  handleClick(chessboard[row_idx][col_idx], row_idx, col_idx);
                }}
              >
                <div
                  className={
                    selectedPiece !== null &&
                    selectedPiece.x === row_idx &&
                    selectedPiece.y === col_idx
                      ? "chess_field_highlight selected"
                      : possibleMovesOfSelected.findIndex(
                          (x) => x.row === row_idx && x.col === col_idx
                        ) >= 0
                      ? "chess_field_highlight possible"
                      : "chess_field_highlight"
                  }
                ></div>
                {printPiece(chessboard[row_idx][col_idx].piece)}
              </div>
            );
          });
        })}
        <div className="chess_board_outer_row horizontal top">
          {cols.map((x) => {
            return <div>{x}</div>;
          })}
        </div>
        <div className="chess_board_outer_row horizontal bottom">
          {cols.map((x) => {
            return <div>{x}</div>;
          })}
        </div>
        <div className="chess_board_outer_row vertical left">
          {rows.map((x) => {
            return <div>{x}</div>;
          })}
        </div>
        <div className="chess_board_outer_row vertical right">
          {rows.map((x) => {
            return <div>{x}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default Chess;
