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
  setRecordNotes: (x) => {},
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
          id: Math.random().toString(),
          midiNumber: note.e,
          time: note.start - currentTime,
          duration: note.duration,
        };
      })
    );
  };



  useEffect(() => {
    if (lastPlayedNote !== null && recording) {
      setNotes((state) => {
        return [...state, lastPlayedNote];
      });
    }
    // eslint-disable-next-line
  }, [lastPlayedNote]);

  useEffect(() => {
    if (stopNote !== null && stopNote.prev.length > 0 && recording) {
      if (stopNote.prev.includes(stopNote.e) ) {
        setNotes((state) => {
          let temp_ar = state;
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
    // eslint-disable-next-line
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
        setRecordNotes: setRecordNotes,
      }}
    >
      {props.children}
    </RecordContext.Provider>
  );
};

export default RecordContext;
