import { useState, useEffect } from 'react';
import GameBox from './GameBox';
import GameDetails from './GameDetails';
import UserProfile from './UserProfile';
import ExportButton from './ExportButton';
import SteamIdForm from './SteamIdForm';
import { Clock, BookOpen, Trophy } from 'lucide-react';
import { Bookcase, GameModel } from './Models';

const GameShelf = () => {
  const [bookcaseData, setBookcaseData] = useState<Bookcase | null>({
    user: { id: 0, name: '', avatar: '' },
    booklist: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameModel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const fetchGameDataBySteamId = async (steamId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/generate_from_id?steamid=${steamId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setBookcaseData({
        user: {
          id: data.user.id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        booklist: data.booklist.map((game: any) => ({
          app_id: game.app_id,
          app_name: game.app_name,
          box_art: game.box_art,
          app_description: game.app_description,
          player_information: {
            playtime_forever: game.player_information.playtime_forever,
            playtime_windows_forever: game.player_information.playtime_windows_forever,
            playtime_mac_forever: game.player_information.playtime_mac_forever,
            playtime_linux_forever: game.player_information.playtime_linux_forever,
            playtime_deck_forever: game.player_information.playtime_deck_forever,
            rtime_last_played: game.player_information.rtime_last_played
          }
        }))
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error fetching game data:', err);
      setError('Failed to fetch Steam data. Please check your Steam ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = (importedData: Bookcase) => {
    setBookcaseData(importedData);
    setShowForm(false);
  };

  const totalPlaytime = bookcaseData && Array.isArray(bookcaseData.booklist)
    ? bookcaseData.booklist.reduce((total, game) => total + game.player_information.playtime_forever, 0)
    : 0;

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours.toLocaleString()}h`;
  };

  const handleGameClick = (game: GameModel) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <SteamIdForm 
          onSubmitSteamId={fetchGameDataBySteamId}
          onImportData={handleImportData}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading your game collection...</p>
        </div>
      </div>
    );
  }

  if (!bookcaseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load game collection</p>
          {error && <p className="text-gray-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error}
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <UserProfile user={bookcaseData.user} />
            <ExportButton bookcaseData={bookcaseData} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Games</p>
                  <p className="text-2xl font-bold text-gray-900">{bookcaseData.booklist.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Playtime</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPlaytime(totalPlaytime)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. per Game</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPlaytime(Math.round(totalPlaytime / bookcaseData.booklist.length))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Shelf */}
        <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg p-6 shadow-2xl">
          <div className="relative">
            {/* Shelf Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg"></div>
            <div className="absolute inset-0 bg-wood-pattern opacity-20 rounded-lg"></div>
            
            {/* Games Grid */}
            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {bookcaseData.booklist.map((game) => (
                <GameBox key={game.app_id} game={game} onClick={handleGameClick} />
              ))}
            </div>
            
            {/* Shelf Edges */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-b-lg shadow-inner"></div>
          </div>
        </div>
      </div>

      <GameDetails 
        game={selectedGame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default GameShelf;
