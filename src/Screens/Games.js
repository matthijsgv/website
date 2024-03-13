import "../style/Games.css";

import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { FaBomb } from "react-icons/fa";
import { MdFlag, MdMusicNote } from "react-icons/md";
import TopBar from "../UI/TopBar";
import snakeHead from "../images/snake-head.png";
import space from "../images/space.jpg";
import { RoutePath } from "../Constants/RoutePath";

const Games = () => {
  const navigate = useNavigate();

  let initialTiles = [...Array(242).fill("")];

  const fillTilesWithValue = (list, value) => {
    for (let i of list) {
      initialTiles[i] = value;
    }
  };

  fillTilesWithValue(
    [
      0, 1, 2, 3, 4, 5, 14, 16, 18, 19, 21, 37, 48, 60, 44, 28, 29, 53, 56, 59,
      68, 69, 99, 100, 103, 116, 119,
    ],
    "1"
  );
  fillTilesWithValue([17, 20, 49, 50, 52, 113, 97, 81, 115], "flag");
  fillTilesWithValue(
    [30, 32, 36, 37, 51, 57, 58, 64, 67, 80, 82, 72, 88, 104, 112],
    "2"
  );
  fillTilesWithValue([33, 34, 35, 66, 96, 65, 114], "3");
  fillTilesWithValue(
    [
      6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 25, 26, 27, 38, 39, 40, 41, 42,
      43, 54, 55, 70, 71, 83, 84, 85, 86, 87, 101, 102, 117, 118,
    ],
    " "
  );
  fillTilesWithValue([98], "4");
  return (
    <div className="games-outer">
      <TopBar title="Games">
        <div
          className="back-icon"
          onClick={() => {
            navigate(RoutePath.ROOT);
          }}
        >
          <MdArrowBack />
        </div>
      </TopBar>
      <div className="games-grid">
        <div className="games-widget-outer">
          <div
            className="games-widget"
            onClick={() => {
              navigate(RoutePath.MATTHIJSLE + "?mode=daily");
            }}
          >
            <div className="matthijsle-title">
              <div className="matthijsle-title-tile">M</div>
              <div className="matthijsle-title-tile">A</div>
              <div className="matthijsle-title-tile green">T</div>
              <div className="matthijsle-title-tile yellow">T</div>
              <div className="matthijsle-title-tile">H</div>
              <div className="matthijsle-title-tile yellow">I</div>
              <div className="matthijsle-title-tile">J</div>
              <div className="matthijsle-title-tile green">S</div>
              <div className="matthijsle-title-tile green">L</div>
              <div className="matthijsle-title-tile">E</div>
            </div>
            <div className="matthijsle-subtitle">Daily mode</div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget"
            onClick={() => {
              navigate( RoutePath.MATTHIJSLE +"?mode=unlimited");
            }}
          >
            <div className="matthijsle-title">
              <div className="matthijsle-title-tile">M</div>
              <div className="matthijsle-title-tile">A</div>
              <div className="matthijsle-title-tile green">T</div>
              <div className="matthijsle-title-tile yellow">T</div>
              <div className="matthijsle-title-tile">H</div>
              <div className="matthijsle-title-tile yellow">I</div>
              <div className="matthijsle-title-tile">J</div>
              <div className="matthijsle-title-tile green">S</div>
              <div className="matthijsle-title-tile green">L</div>
              <div className="matthijsle-title-tile">E</div>
            </div>
            <div className="matthijsle-subtitle">Unlimited mode</div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget sweeper"
            onClick={() => {
              navigate(RoutePath.MINESWEEPER);
            }}
          >
            <div className="matthijs-sweeper-tile">
              <div className="matthijs-sweeper-title">
                Matthijs <br /> Sweeper
              </div>
              <div className="matthijs-sweeper-widget-background">
                <div className="matthijs-sweeper-widget-background-tiles">
                  {initialTiles.map((x, idx) => {
                    return (
                      <div
                        key={Math.random().toString()}
                        className="tile"
                        value={x}
                      >
                        {x === "bomb" ? (
                          <FaBomb />
                        ) : x === "flag" ? (
                          <MdFlag />
                        ) : (
                          x
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget music"
            onClick={() => {
              navigate(RoutePath.MUSIC_QUIZ);
            }}
          >
            <div className="music_quiz_widget_background">
              <div className="music_note a">
                <MdMusicNote />
              </div>
              <div className="music_note b">
                <MdMusicNote />
              </div>
              <div className="music_note c">
                <MdMusicNote />
              </div>
              <div className="music_note d">
                <MdMusicNote />
              </div>
              <div className="music_note e">
                <MdMusicNote />
              </div>
              <div className="music_note f">
                <MdMusicNote />
              </div>
              <div className="music_note g">
                <MdMusicNote />
              </div>
              <div className="music_note h">
                <MdMusicNote />
              </div>
              <div className="music_note i">
                <MdMusicNote />
              </div>
              <div className="music_note j">
                <MdMusicNote />
              </div>
              <div className="music_note k">
                <MdMusicNote />
              </div>
              <div className="music_note l">
                <MdMusicNote />
              </div>
              <div className="music_note m">
                <MdMusicNote />
              </div>
              <div className="music_note n">
                <MdMusicNote />
              </div>
              <div className="music_note o">
                <MdMusicNote />
              </div>
              <div className="music_note p">
                <MdMusicNote />
              </div>
              <div className="music_note q">
                <MdMusicNote />
              </div>
              <div className="music_note r">
                <MdMusicNote />
              </div>
            </div>
            <div className="music_quiz_upper_title">Matthijs'</div>
            <div className="music_quiz_lower_title">Music Quiz</div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget snake"
            onClick={() => {
              navigate(RoutePath.SNAKE);
            }}
          >
            <div className="snake-widget">
              <div className="snake-body a"></div>
              <div className="snake-body b"></div>
              <div className="snake-body c"></div>
              <div className="snake-tail"></div>
              <div className="snake-tongue">
                <div className="snake-tongue-tip"></div>
                <div className="snake-tongue-tip-right"></div>
              </div>
              <div className="snake-title">S N A K E</div>
              <img className="snake-head" src={snakeHead} alt="snakehead"></img>
            </div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget"
            onClick={() => {
              navigate(RoutePath.TETRIS);
            }}
          >
            <div className="tetris_widget_background">
              <img className="space-image" src={space} alt="space" />
              <div className="tetris_letter t">
                {[
                  true,
                  true,
                  true,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
              <div className="tetris_letter e">
                {[
                  true,
                  true,
                  true,

                  true,
                  false,
                  false,

                  true,
                  true,
                  true,

                  true,
                  false,
                  false,

                  true,
                  true,
                  true,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
              <div className="tetris_letter t2">
                {[
                  true,
                  true,
                  true,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
              <div className="tetris_letter r">
                {[
                  true,
                  true,
                  false,

                  true,
                  false,
                  true,

                  true,
                  true,
                  false,

                  true,
                  false,
                  true,

                  true,
                  false,
                  true,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
              <div className="tetris_letter i">
                {[
                  true,
                  true,
                  true,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  false,
                  true,
                  false,

                  true,
                  true,
                  true,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
              <div className="tetris_letter s">
                {[
                  true,
                  true,
                  true,

                  true,
                  false,
                  false,

                  true,
                  true,
                  true,

                  false,
                  false,
                  true,

                  true,
                  true,
                  true,
                ].map((item) => {
                  return (
                    <div key={Math.random().toString()} className={item ? "pixel filled" : "pixel"}></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="games-widget-outer">
          <div
            className="games-widget ttfe"
            onClick={() => {
              navigate(RoutePath.TFE);
            }}
          >
            <div className="ttfe_widget">
              <div className="ttfe_title">
                <div className="ttfe_title_tile">2</div>
                <div className="ttfe_title_tile">0</div>
                <div className="ttfe_title_tile">4</div>
                <div className="ttfe_title_tile">8</div>
              </div>
              <div className="ttfe_row">
                <div className="ttfe_widget_tile tile2">2</div>
                <div className="ttfe_widget_tile tile2">2</div>
                <div className="ttfe_widget_tile tile4">4</div>
                <div className="ttfe_widget_tile tile4">4</div>
                <div className="ttfe_widget_tile tile8">8</div>
                <div className="ttfe_widget_tile tile8">8</div>
              </div>
              <div className="ttfe_row">
                <div className="ttfe_widget_tile tile64">64</div>
                <div className="ttfe_widget_tile tile64">64</div>
                <div className="ttfe_widget_tile tile32">32</div>
                <div className="ttfe_widget_tile tile32">32</div>
                <div className="ttfe_widget_tile tile16">16</div>
                <div className="ttfe_widget_tile tile16">16</div>
              </div>
              <div className="ttfe_row">
                <div className="ttfe_widget_tile tile128">128</div>
                <div className="ttfe_widget_tile tile128">128</div>
                <div className="ttfe_widget_tile tile256">256</div>
                <div className="ttfe_widget_tile tile256">256</div>
                <div className="ttfe_widget_tile tile512">512</div>
                <div className="ttfe_widget_tile tile1024">1024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
