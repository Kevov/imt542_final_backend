
import { GameModel } from './Models';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Clock, Calendar, Monitor, Apple, Gamepad2 } from 'lucide-react';

interface GameDetailsProps {
  game: GameModel | null;
  isOpen: boolean;
  onClose: () => void;
}

const GameDetails = ({ game, isOpen, onClose }: GameDetailsProps) => {
  if (!game) return null;

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes % 60}m`;
  };

  const formatLastPlayed = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-400">
            {game.app_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Game Image */}
          <div className="relative aspect-[460/215] overflow-hidden rounded-lg">
            <img
              src={game.box_art}
              alt={game.app_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{game.app_description}</p>
          </div>

          {/* Playtime Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Playtime Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Playtime</p>
                  <p className="font-semibold">{formatPlaytime(game.player_information.playtime_forever)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Last Played</p>
                  <p className="font-semibold">{formatLastPlayed(game.player_information.rtime_last_played)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Monitor className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Windows Playtime</p>
                  <p className="font-semibold">{formatPlaytime(game.player_information.playtime_windows_forever)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Apple className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Mac Playtime</p>
                  <p className="font-semibold">{formatPlaytime(game.player_information.playtime_mac_forever)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Steam Deck Playtime</p>
                  <p className="font-semibold">{formatPlaytime(game.player_information.playtime_deck_forever)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Monitor className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Linux Playtime</p>
                  <p className="font-semibold">{formatPlaytime(game.player_information.playtime_linux_forever)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetails;
