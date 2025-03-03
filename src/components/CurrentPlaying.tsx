import { useState, useRef, useEffect } from 'react';
import { FaPlayCircle, FaPauseCircle, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Station {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  language: string;
}

interface CurrentPlayingProps {
  station: Station;
}

const CurrentPlaying = ({ station }: CurrentPlayingProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // When station changes, start playing automatically
    if (audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.play().catch(error => console.error("Playback error:", error));
      setIsPlaying(true);
    }
  }, [station.url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Playback error:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <article className="relative overflow-hidden">
      <audio ref={audioRef} src={station.url} />
      
      <div className="flex items-center p-5 rounded-lg bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-center mr-6">
          <button 
            onClick={togglePlay}
            className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            {isPlaying ? 
              <FaPauseCircle size={28} className="text-white" /> : 
              <FaPlayCircle size={28} className="text-white" />
            }
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {station.name || "Unknown Station"}
              </h2>
              <p className="text-gray-300">
                {station.country || "Unknown Location"} • {station.tags?.split(',')[0] || "Various"}
              </p>
            </div>
            
            <button 
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              {isMuted ? 
                <FaVolumeMute size={20} className="text-gray-400" /> : 
                <FaVolumeUp size={20} className="text-white" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Optional station image/logo */}
    {station.favicon && (
      <div className="absolute top-0 right-0 h-full w-1/4 opacity-10 pointer-events-none">
        <img 
          src={station.favicon} 
          alt={station.name} 
          className="h-full w-full object-cover"
          onError={(e) => { 
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    )}
    </article>
  );
};

export default CurrentPlaying;