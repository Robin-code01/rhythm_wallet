import { createContext, useContext, useState } from "react";

const AudioBarContext = createContext();

export function AudioBarProvider({ children }) {
  const [audioState, setAudioState] = useState({
    playlist: [],
    currentSong: null,
  });

  // Set a new playlist and song (when user clicks a song)
  function playSong(song, playlist) {
    setAudioState({
      playlist,
      currentSong: song,
    });
  }

  // Next/Prev song logic
  function nextSong() {
    if (!audioState.currentSong || audioState.playlist.length === 0) return;
    const idx = audioState.playlist.findIndex(s => s.song_id === audioState.currentSong.song_id);
    const nextIdx = (idx + 1) % audioState.playlist.length;
    setAudioState({
      ...audioState,
      currentSong: audioState.playlist[nextIdx],
    });
  }
  function prevSong() {
    if (!audioState.currentSong || audioState.playlist.length === 0) return;
    const idx = audioState.playlist.findIndex(s => s.song_id === audioState.currentSong.song_id);
    const prevIdx = (idx - 1 + audioState.playlist.length) % audioState.playlist.length;
    setAudioState({
      ...audioState,
      currentSong: audioState.playlist[prevIdx],
    });
  }

  return (
    <AudioBarContext.Provider value={{ audioState, playSong, nextSong, prevSong }}>
      {children}
    </AudioBarContext.Provider>
  );
}

export function useAudioBar() {
  return useContext(AudioBarContext);
}