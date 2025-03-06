import React from 'react';
import { RoutePath } from "../../Constants/RoutePath";
import GamesWidget from "./GamesWidget";

const SolitaireWidget = () => {

    return <GamesWidget navigateTo={RoutePath.SOLITAIRE}>
        <div className="solitaire_widget">
            <div className="solitaire_widget_cards_outer">
                <div className="solitaire"></div>
            </div>
            <div className="solitaire_widget_title">Solitaire</div>
        </div>
    </GamesWidget>
};

export default SolitaireWidget;
