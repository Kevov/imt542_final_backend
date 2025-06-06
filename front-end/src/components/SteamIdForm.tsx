
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, User as UserModel } from 'lucide-react';
import { Bookcase } from './Models';

interface SteamIdFormProps {
  onSubmitSteamId: (steamId: string) => void;
  onImportData: (data: Bookcase) => void;
  loading: boolean;
  error: string | null;
}

const SteamIdForm = ({ onSubmitSteamId, onImportData, loading, error }: SteamIdFormProps) => {
  const [steamId, setSteamId] = useState('');
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'steamid' | 'import'>('steamid');

  const handleSteamIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Submitting Steam ID:', steamId);
    // onSubmitSteamId(steamId.trim());
    if (steamId.trim()) {
      onSubmitSteamId(steamId.trim());
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importText);
      if (parsed.bookcase) {
        onImportData(parsed.bookcase);
      } else {
        alert('Invalid JSON format. Please ensure your data has a "bookcase" property.');
      }
    } catch (err) {
      alert('Invalid JSON format. Please check your data and try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Game Shelf Gallery</h1>
          <p className="text-gray-600">Enter your Steam ID or import your game collection</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('steamid')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'steamid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserModel className="w-4 h-4" />
            <span>Steam ID</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>

        {activeTab === 'steamid' ? (
          <form onSubmit={handleSteamIdSubmit} className="space-y-4">
            <div>
              <Label htmlFor="steamid">Steam ID</Label>
              <Input
                id="steamid"
                type="text"
                placeholder="Enter your Steam ID (e.g., 76561198093350449)"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !steamId.trim()}>
              {loading ? 'Loading...' : 'Load Games'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <Label htmlFor="import">Import JSON Data</Label>
              <textarea
                id="import"
                placeholder="Paste your exported JSON data here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!importText.trim()}>
              Import Games
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SteamIdForm;
