import "../style/Calculator.css";

import { useEffect, useState, useRef } from "react";
import { evaluate } from "mathjs";
import {
  TbPlusMinus,
  TbParentheses,
  TbDivide,
  TbX,
  TbMinus,
  TbPlus,
  TbEqual,
  TbBackspace,
  TbPointFilled,
} from "react-icons/tb";

const Calculator = () => {
  const [equationError, setEquationError] = useState(false);
  const [currentEquation, setCurrentEquation] = useState("");
  const [currentPart, setCurrentPart] = useState({
    value: "",
    withParenthesis: "",
    negative: false,
  });
  const [equationParts, setEquationParts] = useState([]);
  const [operators, setOperators] = useState([]);
  const [openParenthesis, setOpenParenthesis] = useState(0);
  const [closedParenthesis, setClosedParenthesis] = useState(0);
  const isSolved = useRef(false);

  useEffect(() => {
    setEquationError(false);
    scrollInView();
    setOpenParenthesis(currentEquation.split("(").length - 1);
    setClosedParenthesis(currentEquation.split(")").length - 1);
  }, [currentEquation]);

  const scrollInView = () => {
    let elem = document.getElementById("calculator_display");
    if (isSolved.current) {
      elem.scrollLeft = 0;
    } else {
      elem.scrollLeft = elem.scrollWidth;
    }

    isSolved.current = false;
  };

  const buttons = [
    "C",
    "+/-",
    "( )",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "b",
    "0",
    ".",
    "=",
  ];


  const addToEquation = (c) => {
    const operators = ["*", "+", "-", "/"];
    const parenthesis = ["(", ")"];

    if (operators.includes(c)) {
      setOperators((state) => [...state, c]);
      setCurrentPart((state) => {
        setEquationParts((s) => {
          console.log("STATE", state);
          return [...s, state];
        });
        return {
          value: "",
          withParenthesis: "",
          negative: state.value.length === 0 && c === "-" ? true : false,
        };
      });
    } else if (parenthesis.includes(c)) {
      setCurrentPart((state) => {
        let temp = { ...state };
        temp.withParenthesis = temp.withParenthesis + c;
        return temp;
      });
    } else {
      setCurrentPart((state) => {
        let tempState = { ...state };
        tempState.withParenthesis = tempState.withParenthesis + c;
        tempState.value = tempState.value + c;
        return tempState;
      });
    }

    setCurrentEquation((state) => (state += c));
    scrollInView();
  };

  const backspace = () => {
    const operators = ["*", "+", "-", "/"];
    console.log("within backspace", currentPart);
    let toDelete = currentEquation.slice(-1);
    if (operators.includes(toDelete)) {
      setOperators((state) => state.slice(0, state.length - 1));
      setCurrentPart(equationParts[equationParts.length - 1]);
      setEquationParts((state) => state.slice(0, state.length - 1));
    } else {
      setCurrentPart((state) => {
        let temp = { ...state };
        temp.value =
          !isNaN(currentEquation.charAt(currentEquation.length - 1)) ||
          currentEquation.charAt(currentEquation.length - 1) === "."
            ? temp.value.slice(0, temp.value.length - 1)
            : temp.value;
        temp.withParenthesis = temp.withParenthesis.slice(
          0,
          temp.withParenthesis.length - 1
        );
        return temp;
      });
    }

    setCurrentEquation((state) => state.slice(0, state.length - 1));
  };

  const makeNegativeOrPositive = () => {
    let temp = {
      ...currentPart,
    };

    let splittedCur =
      currentPart.value.length === 0
        ? [currentPart.withParenthesis, ""]
        : currentPart.withParenthesis.split(currentPart.value);

    console.log("splitted", splittedCur);
    if (temp.negative) {
      let ops = [...operators];
      let parts = [...equationParts];
      ops = ops.slice(0, ops.length - 1);
      parts = parts.slice(0, parts.length - 1);
      let newEquation = "";
      for (let i = 0; i < parts.length; i++) {
        newEquation += parts[i].withParenthesis;
        newEquation += ops[i];
      }
      newEquation += currentPart.withParenthesis;
      setOperators(ops);
      setEquationParts(parts);
      setCurrentEquation(newEquation);
      setOpenParenthesis(newEquation.split("(").length - 1);
      setClosedParenthesis(newEquation.split(")").length - 1);
    } else {
      console.log("hier gebeurt het");
      for (let i = 0; i < temp.withParenthesis.length; i++) {
        backspace();
      }
      for (let i = 0; i < splittedCur[0].length; i++) {
        addToEquation(splittedCur[0][i]);
      }
      addToEquation("-");
      for (let i = 0; i < temp.value.length; i++) {
        addToEquation(temp.value[i]);
      }
      for (let i = 0; i < splittedCur[1].length; i++) {
        addToEquation(splittedCur[1][i]);
      }
    }

    temp.negative = !temp.negative;
    setCurrentPart(temp);

    // let newEquation = equationParts.map((part, idx) => )
  };

  const processButton = (b) => {
    switch (b) {
      case "C":
        setCurrentEquation("");
        setCurrentPart({ value: "", withParenthesis: "", negative: false });
        setEquationParts([]);
        setOperators([]);

        break;
      case "+/-":
        makeNegativeOrPositive();
        break;
      case "( )":
        handleParenthesis();
        break;
      case "b":
        backspace();
        // setCurrentEquation((state) => state.slice(0, state.length - 1));
        break;
      case "=":
        solveEquation();
        break;
      default:
        if (
          !isNaN(b) &&
          currentEquation.charAt(currentEquation.length - 1) === ")"
        ) {
          addToEquation("*");
        }
        addToEquation(b);
    }
  };

  const handleParenthesis = () => {
    if (currentPart.value.length === 0) {
      addToEquation("(");
    } else if (openParenthesis <= closedParenthesis) {
      addToEquation("*");
      addToEquation("(");
    } else {
      addToEquation(")");
      setClosedParenthesis((state) => state + 1);
    }
  };

  const solveEquation = () => {
    try {
      let newVal = evaluate(currentEquation);
      isSolved.current = true;
      setCurrentEquation(newVal.toString());

      if (newVal < 0) {
        setEquationParts([{ value: "", negative: false }]);
        setOperators(["-"]);
        setCurrentPart({
          value: newVal.toString().slice(1),
          withParenthesis: newVal.toString().slice(1),
          negative: true,
        });
      } else {
        setEquationParts([]);
        setOperators([]);
        setCurrentPart({
          value: newVal.toString(),
          withParenthesis: newVal.toString(),
          negative: false,
        });
      }

      setOpenParenthesis(0);
      setClosedParenthesis(0);
    } catch (error) {
      setEquationError(true);
    }
  };

  const CalculatorButton = (props) => {
    const [clicked, setClicked] = useState(false);

    let classNameBase = isNaN(props.button)
      ? "calculator_button_inner utility"
      : "calculator_button_inner";

    return (
      <div className="calculator_button_outer">
        <div
          value={props.button}
          onClick={() => processButton(props.button)}
          className={clicked ? classNameBase + " clicked" : classNameBase}
          onTouchStart={() => setClicked(true)}
          onTouchEnd={() => setClicked(false)}
          onMouseDown={() => setClicked(true)}
          onMouseUp={() => setClicked(false)}
        >
          {props.button === "+/-" ? (
            <TbPlusMinus />
          ) : props.button === "( )" ? (
            <TbParentheses />
          ) : props.button === "/" ? (
            <TbDivide />
          ) : props.button === "*" ? (
            <TbX />
          ) : props.button === "-" ? (
            <TbMinus />
          ) : props.button === "+" ? (
            <TbPlus />
          ) : props.button === "=" ? (
            <TbEqual />
          ) : props.button === "b" ? (
            <TbBackspace />
          ) : props.button === "." ? (
            <TbPointFilled />
          ) : (
            props.button
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="calculator_screen_outer">
      <div className="calculator_outer">
        <div className="calculator_display_outer">
          <input
            id="calculator_display"
            value={currentEquation}
            onKeyDown={(e) => {
              if (e.key === "=") {
                solveEquation();
              }
            }}
            onChange={(e) => {
              if (e.nativeEvent.data !== "=") {
                addToEquation(e.nativeEvent.data);
              }
            }}
            className={
              equationError ? "calculator_display error" : "calculator_display"
            }
          ></input>
        </div>

        <div className="calculator_buttons">
          {buttons.map((b) => {
            return <CalculatorButton button={b} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
