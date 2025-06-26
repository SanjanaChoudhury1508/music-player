import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";

/* --- 3-song playlist (replace paths with your own) --- */
const playlist = [
  {
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    cover: "/src/assets/covers/1.jpg",  // src/assets/…
    src:   "/src/assets/songs/1.mp3",
  },
  {
    title: "Soni Soni",
    artist: "Vishal Mishra",
    cover: "/src/assets/covers/2.jpg",
    src:   "/src/assets/songs/2.mp3",
  },
  {
    title: "Kesariya – (Lo-fi)",
    artist: "Pritam • Arijit",
    cover: "/src/assets/covers/3.jpg",
    src:   "/src/assets/songs/3.mp3",
  },
];

export default function MusicPlayer() {
  const [index, setIndex]         = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);   // 0-100 %
  const audioRef = useRef(null);

  /* whenever song index changes, load + (auto-)play */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();          // reload new src
    setProgress(0);
    if (isPlaying) audio.play();
    // eslint-disable-next-line
  }, [index]);

  /* ===== event handlers ===== */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else           audio.play();
    setIsPlaying(!isPlaying);
  };

  const nextSong = () =>
    setIndex((i) => (i + 1) % playlist.length);

  const prevSong = () =>
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    setProgress(pct || 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) audio.muted = !audio.muted;
  };

  /* ===== render ===== */
  const { title, cover, src } = playlist[index];

  return (
    <div className="player">
      <img className="cover" src={cover} alt={title} />

      {/* scrolling title */}
      <div className="scroll-title">
        <span>{title.toUpperCase()}</span>
      </div>

      {/* progress bar */}
      <div className="progress" style={{ "--p": `${progress}%` }}>
        <div className="bar" />
      </div>

      {/* controls */}
      <div className="controls">
        <button onClick={prevSong}>⏮</button>
        <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
        <button onClick={nextSong}>⏭</button>
        <button onClick={toggleMute}>🔇</button>
      </div>

      {/* hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />
    </div>
  );
}
