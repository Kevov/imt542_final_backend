import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { GameModel } from './Models';

interface GameBoxProps {
  game: GameModel;
  onClick: (game: GameModel) => void;
}

const GameBox = ({ game, onClick }: GameBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes % 60}m`;
  };

  const formatLastPlayed = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    onClick(game);
  };

  return (
    <div 
      className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Game Box Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transform-gpu perspective-1000">
        {/* 3D Box Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform translate-x-1 translate-y-1 -z-10 rounded-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-700 to-gray-800 transform translate-x-0.5 translate-y-0.5 -z-5 rounded-lg"></div>
        
        {/* Game Cover */}
        <div className="relative aspect-[460/215] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-500 text-sm">Loading...</div>
            </div>
          )}
          <img
            src={game.box_art}
            alt={game.app_name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=460&h=215&fit=crop';
              setImageLoaded(true);
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Game title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white text-xs font-semibold truncate drop-shadow-lg">
              {game.app_name}
            </h3>
          </div>
        </div>

        {/* Hover tooltip */}
        {isHovered && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-50 border border-gray-700">
            <h4 className="font-bold text-sm mb-2 text-blue-400">{game.app_name}</h4>
            <p className="text-xs text-gray-300 mb-3 line-clamp-3">{game.app_description}</p>
            
            <div className="space-y-1">
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>Playtime: {formatPlaytime(game.player_information.playtime_forever)}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Last played: {formatLastPlayed(game.player_information.rtime_last_played)}</span>
              </div>
            </div>
            
            {/* Tooltip arrow */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Spine effect for depth */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-600 to-gray-800 transform translate-x-full rounded-r-sm shadow-md"></div>
    </div>
  );
};

export default GameBox;
