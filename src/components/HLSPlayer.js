import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

const HLSPlayer = (props) => {
  const url = props.stationUrl;
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(1);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().play();
    }
    setPlaying(true);
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().pause();
    }
    setPlaying(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setVolumeLevel(isMuted ? 1 : 0);
  };

  const handleVolumeChange = (volume) => {
    if (playerRef.current) {
      playerRef.current.getInternalPlayer().volume = volume;
      setVolumeLevel(volume);
      if (volume > 0 && isMuted) {
        setIsMuted(false);
      }
    }
  };

  const setDefaultAlert = () => {
    alert(
      "Sorry, this station is offline or unavailable in your region. Please select another stream."
    );
  };

  // const handlePlayerError = () => {
  //   if (playerRef.current) {
  //     playerRef.current.getInternalPlayer().load(); // Retry loading the media
  //     playerRef.current.getInternalPlayer().play(); // Start playing again
  //   }
  // };

  return (
    <div className="hlsplayer">
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls={false}
        playing={true}
        muted={isMuted}
        config={{
          file: {
            attributes: {
              playsInline: true,
            },
          },
        }}
        width="100%"
        height="auto"
        volume={1}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={setDefaultAlert}
      />

      <div className="playerControls">
        <div className="playPause">
          {playing ? (
            <button className="playerButton pause" onClick={handlePause}>
              <i className="fa-solid fa-pause"></i>
            </button>
          ) : (
            <button className="playerButton play" onClick={handlePlay}>
              <i className="fa-solid fa-play"></i>
            </button>
          )}
        </div>
        <div className="volume">
          <button className="mute" onClick={handleToggleMute}>
            {isMuted ? (
              <i className="fa-solid fa-volume-xmark"></i>
            ) : volumeLevel === 0 ? (
              <i className="fa-solid fa-volume-mute"></i>
            ) : volumeLevel < 0.5 ? (
              <i className="fa-solid fa-volume-low"></i>
            ) : (
              <i className="fa-solid fa-volume-high"></i>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            defaultValue={volumeLevel}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default HLSPlayer;
