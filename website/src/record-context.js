import React, { useEffect, useState } from "react";

const RecordContext = React.createContext({
    recordNotes: [],
  lastPlayedNote: {},
  setLastPlayedNote: (x) => {},
  stopNote: {},
  setStopNote: (x) => {},
  onStartRecording: () => {},
  onStopRecording: () => {},
  recording: false,
});

export const RecordProvider = (props) => {
  const [notes, setNotes] = useState([]);
  const [recording, setRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const [lastPlayedNote, setLastPlayedNote] = useState(null);
  const [stopNote, setStopNote] = useState(null);

  const [recordNotes, setRecordNotes] = useState([]);

  const onStartRecording = () => {
    setCurrentTime(new Date().getTime());
    setNotes([]);
    setRecording(true);
  };

  const onStopRecording = () => {
    setRecording(false);
    setRecordNotes(
      notes.map((note) => {
        return {
          midiNumber: note.e,
          time: note.start - currentTime,
          duration: note.duration,
        };
      })
    );
  };

  useEffect(() => {
    if (recordNotes !== []) {
      console.log(recordNotes);
    }
  }, [recordNotes]);

  useEffect(() => {
    console.log("Played Note", lastPlayedNote);
    if (lastPlayedNote !== null && recording) {
      setNotes((state) => {
        return [...state, lastPlayedNote];
      });
    }
  }, [lastPlayedNote]);

  useEffect(() => {
    console.log("Stop Note", stopNote)
    if (stopNote !== null && stopNote.prev.length > 0 && recording) {
      if (stopNote.prev.includes(stopNote.e) ) {
        setNotes((state) => {
          let temp_ar = state;
          console.log("Temp array", temp_ar);
          let temp = temp_ar.findIndex(
            (note) => note.e === stopNote.e && note.end === null
          );
          if (temp !== undefined) {
            temp_ar[temp].end = stopNote.end;
            temp_ar[temp].duration = temp_ar[temp].end - temp_ar[temp].start;
          }
          return temp_ar;
        });
      }
    }
  }, [stopNote]);

  return (
    <RecordContext.Provider
      value={{
        lastPlayedNote: lastPlayedNote,
        setLastPlayedNote: setLastPlayedNote,
        stopNote: stopNote,
        setStopNote: setStopNote,
        onStartRecording: onStartRecording,
        onStopRecording: onStopRecording,
        recording: recording,
        recordNotes: recordNotes,
      }}
    >
      {props.children}
    </RecordContext.Provider>
  );
};

export default RecordContext;
