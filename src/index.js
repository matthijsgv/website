import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecordProvider } from "./record-context";
import { MusicQuizProvider } from "./store/music-quiz-context";
import { UserContextProvider } from "./store/user-context";
import { SpotifyProvider } from "store/spotify-context";

ReactDOM.render(
  <UserContextProvider>
    <SpotifyProvider>
      <MusicQuizProvider>
        <RecordProvider>
          <App />
        </RecordProvider>
      </MusicQuizProvider>
      </SpotifyProvider>
  </UserContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
