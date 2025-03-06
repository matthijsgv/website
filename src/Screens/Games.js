import React from 'react';
import "../style/Games.css";

import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { MdMusicNote } from "react-icons/md";
import TopBar from "../UI/TopBar";
import snakeHead from "../images/snake-head.png";
import space from "../images/space.jpg";
import { RoutePath } from "../Constants/RoutePath";
import MatthijsleWidget from "../Components/GamesWidgets/MatthijsleWidget";
import MatthijsSweeperWidget from "../Components/GamesWidgets/MatthijsSweeperWidget";
import ThirtySecondsWidget from "../Components/GamesWidgets/ThirtySecondsWidget";

const Games = () => {
  const navigate = useNavigate();

  return (
    <div className="games-outer">
      <TopBar
        title="Games"
        leftIcon={{
          onClick: () => navigate(RoutePath.ROOT),
          Icon: MdArrowBack,
        }}
      />

      <div className="games-grid">
        <MatthijsleWidget mode="daily" />
        <MatthijsleWidget mode="unlimited" />
        <MatthijsSweeperWidget />
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
                    <div
                      key={Math.random().toString()}
                      className={item ? "pixel filled" : "pixel"}
                    ></div>
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
        {/* <SolitaireWidget /> */}
        <ThirtySecondsWidget/>
      </div>
    </div>
  );
};

export default Games;
