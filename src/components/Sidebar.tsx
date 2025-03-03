import { FaTimes, FaCog, FaHeart, FaTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Station {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  language: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Station[];
  onSelectStation: (station: Station) => void;
  onRemoveFavorite?: (station: Station) => void; 
}

const Sidebar = ({ isOpen, onClose, favorites, onSelectStation, onRemoveFavorite }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<Station[]>([]);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFavorites(favorites);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = favorites.filter(station => 
      station.name.toLowerCase().includes(lowercaseSearch) || 
      station.country.toLowerCase().includes(lowercaseSearch) ||
      (station.tags && station.tags.toLowerCase().includes(lowercaseSearch))
    );
    
    setFilteredFavorites(filtered);
  }, [searchTerm, favorites]);

  const handleRemoveFavorite = (e: React.MouseEvent, station: Station) => {
    e.stopPropagation();
    if (onRemoveFavorite) {
      onRemoveFavorite(station);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Radio Browser
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <input 
            type="text" 
            className='bg-gray-800 rounded-lg w-full py-2 px-4 text-white border border-gray-700 focus:border-purple-500 focus:outline-none' 
            placeholder='Search Favorites'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Favorites Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <FaHeart className="text-purple-500" />
            <h3 className="font-bold text-lg text-white">Favorites</h3>
          </div>
          
          {/* Filtered Favorites List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {favorites.length === 0 ? (
              <div className="text-gray-400 text-center py-4">No favorites yet</div>
            ) : filteredFavorites.length === 0 ? (
              <div className="text-gray-400 text-center py-4">No matches found</div>
            ) : (
              <ul className="space-y-2">
                {filteredFavorites.map(station => (
                  <li 
                    key={station.stationuuid} 
                    className="p-3 rounded-lg bg-gray-800/70 hover:bg-gray-700 cursor-pointer transition-all"
                    onClick={() => {
                      onSelectStation(station);
                      onClose();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={station.favicon || "https://placehold.co/40x40?text=Radio"} 
                          alt={station.name} 
                          className="w-8 h-8 rounded-md mr-3 object-cover"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/40x40?text=Radio" }}
                        />
                        <div>
                          <p className="font-medium text-white">{station.name}</p>
                          <p className="text-xs text-gray-400">{station.country}</p>
                        </div>
                      </div>
                      
                      {/* Remove favorite button */}
                      <button
                        onClick={(e) => handleRemoveFavorite(e, station)}
                        className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from favorites"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-800 text-white hover:text-purple-400 transition-colors">
            <FaCog className="mr-3" />
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;