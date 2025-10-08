import GamesWidget from "./GamesWidget";
import "../../style/Components/GamesWidgets/HitsterWidget.css";
import { RoutePath } from "Constants/RoutePath";
const HitsterWidget = () => {
  return (
    <GamesWidget navigateTo={RoutePath.HITSTER}>
        <div className="hitster_widget_overlay">
            BANGSTER
        </div>
      <div className="hitster_widget_layer a">
        <div className="hitster_widget_layer b">
          <div className="hitster_widget_layer c">
            <div className="hitster_widget_layer d">
                <div className="hitster_widget_layer e"></div>
            </div>
          </div>
        </div>
      </div>
    </GamesWidget>
  );
};

export default HitsterWidget;
