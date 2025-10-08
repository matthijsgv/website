import React from "react";
import "../../style/Hitster.css";
import { HitsterProvider } from "../../store/hitster-context";
import HitsterInner from "./HitsterInner";

const Hitster = (props) => {

  return (
    <HitsterProvider>
      <HitsterInner />
    </HitsterProvider>
  );
};

export default Hitster;
