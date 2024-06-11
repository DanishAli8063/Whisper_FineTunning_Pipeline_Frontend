import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import config from './Config';

let currentlyPlayingAudio = null;

async function fetchAudio(audioFileName) {
  try {
    const response = await axios.post(`${config.apiBaseUrl}/audio`, {
      filename: audioFileName
    }, {
      responseType: 'arraybuffer',
    });

    const audioBlob = new Blob([response.data], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error('Error fetching audio:', error);
    return null;
  }
}

function AudioPlayer({ audioFileName }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    async function getAudio() {
      const url = await fetchAudio(audioFileName);
      setAudioUrl(url);
    }
    
    getAudio();
  }, [audioFileName]);

  const handlePlay = () => {
    if (currentlyPlayingAudio && currentlyPlayingAudio !== audioRef.current) {
      currentlyPlayingAudio.pause();
      currentlyPlayingAudio.currentTime = 0;
    }
    currentlyPlayingAudio = audioRef.current;
  };

  if (!audioUrl) {
    return <div style={{color:"#3F2A7E" , textAlign:"center"}}>Loading...</div>;
  }

  return (
    <audio controls ref={audioRef} onPlay={handlePlay}>
      <source src={audioUrl} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
}

export default AudioPlayer;
