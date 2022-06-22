import { Piano, MidiNumbers } from "react-piano";
import SoundfontProvider from "../SoundfontProvider";
// import "react-piano/dist/styles.css";
import "../style/PianoScreen.css";
import "../style/Piano.css";

import { useState, useEffect, useContext } from "react";
import {
  MdScreenRotation,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { FaMicrophoneAlt, FaPlay, FaStop } from "react-icons/fa";
import RecordContext from "../record-context";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const ResponsivePiano = (props) => {
  return (
    <SoundfontProvider
      instrumentName={props.instrument}
      audioContext={props.audioContext}
      hostname={props.hostname}
      render={({ isLoading, playNote, stopNote }) => (
        <div className="piano">
          {isLoading && (
            <div className="piano-loading">
              <div className="loading-indicator"></div>
            </div>
          )}
          {!isLoading && (
            <Piano
              noteRange={props.noteRange}
              playNote={playNote}
              stopNote={stopNote}
              activeNotes={props.active}
              disabled={isLoading}
              onPlayNoteInput={props.playNoteHandler}
              onStopNoteInput={props.stopNoteHandler}
              {...props}
            />
          )}
        </div>
      )}
    />
  );
};

const PianoScreen = () => {
  const [landscape, setLandscape] = useState(false);

  const [instrument, setInstrument] = useState("acoustic_grand_piano");

  const [startNote, setStartNote] = useState("c3");
  const [endNote, setEndNote] = useState("c5");

  const [possibleStartNotes, setPossibleStartNotes] = useState([]);
  const [possibleEndNotes, setPossibleEndNotes] = useState([]);

  const [events, setEvents] = useState(null);
  const [playing, setPlaying] = useState(false);
  const ctx = useContext(RecordContext);

  useEffect(() => {
    if (events !== null) {
      events.map((event) => event);
    }
  }, [events]);

  useEffect(() => {
    if (playing && !ctx.recording){
      if (ctx.recordNotes.length === 0){
        setPlaying(false);
        return;
      }
      
      //eslint-disable-next-line array-callback-return
      const events = ctx.recordNotes.map((note) => { 
        setTimeout(() => {
          setActive((state) => {
            return [...state, note.midiNumber];
          });
        }, note.time);
        setTimeout(() => {
          setActive((state) => {
            return state.filter((a) => a !== note.midiNumber);
          });
        }, note.time + note.duration);
      });
  
      events.push(
        setTimeout(() => {
          stopSong();
        }, ctx.recordNotes[ctx.recordNotes.length - 1].time + ctx.recordNotes[ctx.recordNotes.length - 1].duration)
      );
  
      setEvents(events);
    } 
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, ctx.recording]);

  const instruments = [
    "accordion",
    "acoustic_bass",
    "acoustic_grand_piano",
    "acoustic_guitar_nylon",
    "acoustic_guitar_steel",
    "agogo",
    "alto_sax",
    "applause",
    "bagpipe",
    "banjo",
    "baritone_sax",
    "bassoon",
    "bird_tweet",
    "blown_bottle",
    "brass_section",
    "breath_noise",
    "bright_acoustic_piano",
    "celesta",
    "cello",
    "choir_aahs",
    "church_organ",
    "clarinet",
    "clavinet",
    "contrabass",
    "distortion_guitar",
    "drawbar_organ",
    "dulcimer",
    "electric_bass_finger",
    "electric_bass_pick",
    "electric_grand_piano",
    "electric_guitar_clean",
    "electric_guitar_jazz",
    "electric_guitar_muted",
    "electric_piano_1",
    "electric_piano_2",
    "english_horn",
    "fiddle",
    "flute",
    "french_horn",
    "fretless_bass",
    "fx_1_rain",
    "fx_2_soundtrack",
    "fx_3_crystal",
    "fx_4_atmosphere",
    "fx_5_brightness",
    "fx_6_goblins",
    "fx_7_echoes",
    "fx_8_scifi",
    "glockenspiel",
    "guitar_fret_noise",
    "guitar_harmonics",
    "gunshot",
    "harmonica",
    "harpsichord",
    "helicopter",
    "honkytonk_piano",
    "kalimba",
    "koto",
    "lead_1_square",
    "lead_2_sawtooth",
    "lead_3_calliope",
    "lead_4_chiff",
    "lead_5_charang",
    "lead_6_voice",
    "lead_7_fifths",
    "lead_8_bass__lead",
    "marimba",
    "melodic_tom",
    "music_box",
    "muted_trumpet",
    "oboe",
    "ocarina",
    "orchestra_hit",
    "orchestral_harp",
    "overdriven_guitar",
    "pad_1_new_age",
    "pad_2_warm",
    "pad_3_polysynth",
    "pad_4_choir",
    "pad_5_bowed",
    "pad_6_metallic",
    "pad_7_halo",
    "pad_8_sweep",
    "pan_flute",
    "percussive_organ",
    "percussion",
    "piccolo",
    "pizzicato_strings",
    "recorder",
    "reed_organ",
    "reverse_cymbal",
    "rock_organ",
    "seashore",
    "shakuhachi",
    "shamisen",
    "shanai",
    "sitar",
    "slap_bass_1",
    "slap_bass_2",
    "soprano_sax",
    "steel_drums",
    "string_ensemble_1",
    "string_ensemble_2",
    "synth_bass_1",
    "synth_bass_2",
    "synth_brass_1",
    "synth_brass_2",
    "synth_choir",
    "synth_drum",
    "synth_strings_1",
    "synth_strings_2",
    "taiko_drum",
    "tango_accordion",
    "telephone_ring",
    "tenor_sax",
    "timpani",
    "tinkle_bell",
    "tremolo_strings",
    "trombone",
    "trumpet",
    "tuba",
    "tubular_bells",
    "vibraphone",
    "viola",
    "violin",
    "voice_oohs",
    "whistle",
    "woodblock",
    "xylophone",
  ];

  useEffect(() => {
    setPossibleEndNotes(
      notes.filter(
        (x, idx) => idx > notes.findIndex((note) => note === startNote) + 6
      )
    );
    setPossibleStartNotes(
      notes.filter(
        (x, idx) => idx < notes.findIndex((note) => note === endNote) - 6
      )
    );
        //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endNote, startNote]);

  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (height < width) {
      setLandscape(true);
    } else {
      setLandscape(false);
    }
  }, [height, width]);

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

  const noteRange = {
    first: MidiNumbers.fromNote(startNote),
    last: MidiNumbers.fromNote(endNote),
  };

  const playSong = () => {
    setPlaying(true);
  };

  const stopSong = () => {
    setPlaying(false);
    setActive([]);
    var id = window.setTimeout(function () {}, 0);

    while (id--) {
      window.clearTimeout(id);
    }
  };

  const playNoteHandler = (e) => {
    ctx.setLastPlayedNote({ e: e, start: new Date().getTime(), end: null });
  };

  const stopNoteHandler = (e, { prevActiveNotes }) => {
    ctx.setStopNote({ e: e, prev: prevActiveNotes, end: new Date().getTime() });
  };

  // const stopNoteHandler = (midiNumber, {prev}) => {
  //   console.log(midiNumber);
  //   console.log(prev);
  // }

  const notes = [
    "c0",
    "d0",
    "e0",
    "f0",
    "g0",
    "a0",
    "b0",
    "c1",
    "d1",
    "e1",
    "f1",
    "g1",
    "a1",
    "b1",
    "c2",
    "d2",
    "e2",
    "f2",
    "g2",
    "a2",
    "b2",
    "c3",
    "d3",
    "e3",
    "f3",
    "g3",
    "a3",
    "b3",
    "c4",
    "d4",
    "e4",
    "f4",
    "g4",
    "a4",
    "b4",
    "c5",
    "d5",
    "e5",
    "f5",
    "g5",
    "a5",
    "b5",
    "c6",
    "d6",
    "e6",
    "f6",
    "g6",
    "a6",
    "b6",
    "c7",
    "d7",
    "e7",
    "f7",
    "g7",
    "a7",
    "b7",
    "c8",
    "d8",
    "e8",
    "f8",
    "g8",
    "a8",
    "b8",
  ];

  const [active, setActive] = useState([]);

  return (
    <div className="piano-screen-outer">
      {landscape && (
        <div>
          <div className="piano-options">
            <div className="piano-note-selection left">
              <div>Start Note </div>
              <div className="note-select-widget">
                <div
                  className="note-select-button left"
                  onClick={() => {
                    setStartNote((state) => {
                      let temp = possibleStartNotes.findIndex(
                        (x) => x === startNote
                      );
                      if (possibleStartNotes.length < 2 || temp === 0) {
                        return state;
                      } else {
                        return possibleStartNotes[temp - 1];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowLeft />
                </div>
                <select
                  value={startNote}
                  onChange={(e) => {
                    setStartNote(e.target.value);
                  }}
                >
                  {possibleStartNotes.map((x) => {
                    return <option value={x} label={x} />;
                  })}
                </select>
                <div
                  className="note-select-button right"
                  onClick={() => {
                    setStartNote((state) => {
                      let temp = possibleStartNotes.findIndex(
                        (x) => x === startNote
                      );
                      if (possibleEndNotes.length < 2) {
                        return state;
                      }
                      if (temp === possibleStartNotes.length - 1) {
                        return state;
                      } else {
                        return possibleStartNotes[temp + 1];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>

            <div className="piano-note-selection">
              <div style={{ color: "transparent", userSelect: "none" }}>
                Octave{" "}
              </div>
              <div className="note-select-widget">
                <div
                  className="note-select-button left"
                  onClick={() => {
                    setStartNote((state) => {
                      let temp = notes.findIndex((x) => x === startNote);
                      if (temp < 7) {
                        return notes[0];
                      } else {
                        return notes[temp - 7];
                      }
                    });
                    setEndNote((state) => {
                      let temp = notes.findIndex((x) => x === startNote);
                      let temp_end = notes.findIndex((x) => x === endNote);

                      if (temp < 7) {
                        return notes[temp_end - temp];
                      } else {
                        return notes[temp_end - 7];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowLeft />
                </div>
                <div className="octave">Octave</div>
                <div
                  className="note-select-button right"
                  onClick={() => {
                    setEndNote((state) => {
                      let temp = notes.findIndex((x) => x === endNote);
                      if (temp > notes.length - 8) {
                        console.log(notes[notes.length - 1]);
                        return notes[notes.length - 1];
                      } else {
                        return notes[temp + 7];
                      }
                    });
                    setStartNote((state) => {
                      let temp_start = notes.findIndex((x) => x === startNote);
                      let temp_end = notes.findIndex((x) => x === endNote);

                      if (temp_end > notes.length - 8) {
                        return notes[
                          temp_start + (notes.length - temp_end - 1)
                        ];
                      } else {
                        return notes[temp_start + 7];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>

            <div className="piano-note-selection right">
              <div>End Note </div>
              <div className="note-select-widget">
                <div
                  className="note-select-button left"
                  onClick={() => {
                    setEndNote((state) => {
                      let temp = possibleEndNotes.findIndex(
                        (x) => x === endNote
                      );
                      if (possibleEndNotes.length < 2 || temp === 0) {
                        return state;
                      } else {
                        return possibleEndNotes[temp - 1];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowLeft />
                </div>
                <select
                  value={endNote}
                  onChange={(e) => {
                    setEndNote(e.target.value);
                  }}
                >
                  {possibleEndNotes.map((x) => {
                    return <option value={x} label={x} />;
                  })}
                </select>
                <div
                  className="note-select-button right"
                  onClick={() => {
                    setEndNote((state) => {
                      let temp = possibleEndNotes.findIndex(
                        (x) => x === endNote
                      );
                      if (possibleEndNotes.length < 2) {
                        return state;
                      }
                      if (temp === possibleEndNotes.length - 1) {
                        return state;
                      } else {
                        return possibleEndNotes[temp + 1];
                      }
                    });
                  }}
                >
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>
          </div>
          <div>
            <ResponsivePiano
              active={active}
              instrument={instrument}
              audioContext={audioContext}
              hostname={soundfontHostname}
              noteRange={noteRange}
              playNoteHandler={playNoteHandler}
              stopNoteHandler={stopNoteHandler}
            />
          </div>
          <div className="piano-bottom-row">
            <div className="instrument-outer">
              Instrument:{" "}
              <select
                className="instrument-select"
                value={instrument}
                onChange={(e) => {
                  setInstrument(e.target.value);
                }}
              >
                {instruments.map((ins) => {
                  let temp = "";
                  // eslint-disable-next-line
                  ins.split("_").map((x, idx) => {
                    if (idx > 0) {
                      temp += " ";
                    }
                    temp += x.charAt(0).toUpperCase() + x.slice(1);
                  });
                  return <option value={ins} label={temp} />;
                })}
              </select>
            </div>
            <div className="playback-options-outer-outer">
            <div className="playback-options-outer">
              <div className="recorder-title">
                <div className="recorder-inner-outer">
                  <div className="recorder-title-inner">Recorder</div>
                </div>
              </div>
              <div className="playback-options-inner">
                <div className="recorder-button-outer">
                  <div
                    className={ctx.recording ? "record-button active": "record-button"}
                    onClick={() => {
                      if (!ctx.recording) {
                        ctx.onStartRecording();
                      } else {
                        ctx.onStopRecording();
                      }
                    }}
                  >
                    <FaMicrophoneAlt />
                  </div>
                </div>
                <div className="recorder-button-outer">
                  <div
                    className="play-button"
                    onClick={async () => {
                      if (playing){
                        stopSong();
                      } else {
                        if (ctx.recording){
                          ctx.onStopRecording();
                        }
                        playSong();
                      }
                    }}
                  >
                    <div style={{ marginLeft: "0.2vw", marginTop: "0.2vw" }}>
                      {playing ? <FaStop /> : <FaPlay />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
      {!landscape && (
        <div className="rotate-screen">
          <MdScreenRotation className="rotate-icon" />
          Rotate your device
        </div>
      )}
    </div>
  );
};

export default PianoScreen;
