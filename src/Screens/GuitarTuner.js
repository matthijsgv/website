import { useEffect, useRef, useState } from "react";
import MicrophoneStream from "microphone-stream";
import Pitchfinder from "pitchfinder";
import "../style/GuitarTuner.css";
import { GiGuitarHead } from "react-icons/gi";
import { MdArrowDropDown } from "react-icons/md";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const GuitarTuner = () => {
  const getUserMedia = require("get-user-media-promise");
  const MicrophoneStream = require("microphone-stream").default;
  const [currentNote, setCurrentNote] = useState(null);
  const [micActive, setMicActive] = useState(false);

  let micRef = useRef();
  let pitchMemory = useRef([]);
  const baseFreq = 440;
  const semiFreq = 69;
  const MEMORY_BUFFER = 1;
  //   useEffect(() => {
  //     for (let i of [...Array(99).keys()].map((x) => x - 49)) {
  //       document
  //         .getElementById(`line_${i}`)
  //         .style.setProperty("--deg", i.toString());
  //     }
  //   }, [micActive]);

  useEffect(() => {
    if (currentNote) {
      console.log(currentNote);
      let wheelArrow = document.getElementById("arrow");
      wheelArrow.style.setProperty("--cents", currentNote.dif.toString());
      let currentNoteDiv = document.getElementById("current-note");
      currentNoteDiv.style.setProperty("--x", currentNote.dif.toString());
    }
  }, [currentNote]);

  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const freqToNote = (freq) => {
    const note = 12 * (Math.log(freq / baseFreq) / Math.log(2));
    return Math.round(note) + semiFreq;
  };

  const correctNoteFrequency = (note) => {
    return baseFreq * Math.pow(2, (note - semiFreq) / 12);
  };

  const noteDif = (freq, note) => {
    return (
      Math.floor(1200 * Math.log(freq / correctNoteFrequency(note))) /
      Math.log(2)
    );
  };

  const noteToString = (note) => {
    const noteString = notes[note % 12];
    return noteString;
  };

  const noteToOctave = (note) => {
    const octave = parseInt(note / 12) - 1;
    return octave;
  };
  const micTest = () => {
    micRef.current = new MicrophoneStream();

    getUserMedia({ video: false, audio: true })
      .then(function (stream) {
        console.log(stream);
        micRef.current.setStream(stream);
        setMicActive(true);
      })
      .catch(function (error) {
        console.log(error);
      });

    micRef.current.on("data", function (chunk) {
      // Optionally convert the Buffer back into a Float32Array
      // (This actually just creates a new DataView - the underlying audio data is not copied or modified.)
      const detectPitch = new Pitchfinder.AMDF({
        maxFrequency: 800,
        minFrequency: 50,
      });
      const pitch = detectPitch(MicrophoneStream.toRaw(chunk));
      if (pitch && pitch > 0.1) {
        if (pitchMemory.current === null) {
          pitchMemory.current = [];
        } else if (pitchMemory.current.length < MEMORY_BUFFER) {
          pitchMemory.current.push(pitch);
        } else if (pitchMemory.current.length >= MEMORY_BUFFER) {
          const frequency =
            (pitchMemory.current.reduce((a, b) => a + b, 0) /
              pitchMemory.current.length) *
            1.09;
          const note = freqToNote(frequency);
          const dif = noteDif(frequency, note);
          const noteName = noteToString(note);
          const octave = noteToOctave(note);
          setCurrentNote((state) => {
            return {
              freq: frequency,
              note: note,
              dif: Math.round(dif),
              noteName: noteName,
              octave: octave,
            };
          });
          console.log(pitchMemory.current);
          pitchMemory.current = [];
        }
      }
    });
  };
  return (
    <div className="guitar_tuner_outer">
      {currentNote && (
        <div className="current_note_display">
          <div className="current_note_decomp">
            <div className="current_note_letter">
              {currentNote.noteName.slice(0, 1)}
            </div>
            <div className="current_note_right_side">
              <div className="current_note_sharp">
                {currentNote.noteName.slice(1)}
              </div>
              <div className="current_note_octave">{currentNote.octave}</div>
            </div>
          </div>

          <div id="current-note" className="current_note_display_colors"></div>
        </div>
      )}

      <div className="note_tune_wheel_outer">
        <div className="tune_direction down">
          <FaLongArrowAltLeft style={{ marginTop: "0.7vw" }} /> Tune down
        </div>
        <div className="tune_direction up">
          Tune up
          <FaLongArrowAltRight style={{ marginTop: "0.7vw" }} />
        </div>

        <div className="note_tune_wheel_number" style={{ "--cents": "0" }}>
          0
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "10" }}>
          10
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "20" }}>
          20
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "30" }}>
          30
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "40" }}>
          40
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "-10" }}>
          -10
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "-20" }}>
          -20
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "-30" }}>
          -30
        </div>
        <div className="note_tune_wheel_number" style={{ "--cents": "-40" }}>
          -40
        </div>

        <div className="note_tune_wheel">
          <div className="note_tune_wheel_center"></div>
          {[...Array(99).keys()]
            .map((x) => x - 49)
            .map((item) => {
              return (
                <div
                  key={Math.random().toString()}
                  id={`line_${item}`}
                  style={{ "--deg": item.toString() }}
                  className={`note_tune_wheel_lines${
                    item % 10 !== 0 ? " small" : ""
                  }`}
                >
                  &#124;
                </div>
              );
            })}
          <div id="arrow" className="note_tune_wheel_arrow">
            <div className="note_tune_wheel_arrow_head"></div>
          </div>
        </div>
      </div>
      {!micActive && (
        <div
          className="start_tuning_button"
          onClick={() => {
            micTest();
          }}
        >
          <GiGuitarHead className="guitar_tuning_icon" /> Start <br /> Tuning
        </div>
      )}
      {micActive && (
        <div
          className="stop_tuning_button"
          onClick={() => {
            micRef.current.stop();
            setMicActive(false);
          }}
        >
          Stop
          <br /> Tuning
        </div>
      )}
    </div>
  );
};

export default GuitarTuner;
