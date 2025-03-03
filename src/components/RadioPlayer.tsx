import { useState, useEffect } from "react";
import RadioSelect from "../components/RadioSelect";
import { FaSearch, FaMusic, FaHeadphones, FaBars } from "react-icons/fa";
import CurrentPlaying from "../components/CurrentPlaying";
import Sidebar from "../components/Sidebar";

interface Station {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  language: string;
}

const RadioPlayer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [favorites, setFavorites] = useState<Station[]>([]);

  // loading favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem('radioFavorites');
    console.log("Loading favorites from storage:", savedFavorites);
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        console.log("Parsed favorites:", parsed);
        setFavorites(parsed);
      } catch (e) {
        console.error("Error loading favorites:", e);
      }
    }
  }, []);
  
  // saving favorites
  useEffect(() => {
    console.log("Saving favorites to storage:", favorites);
    localStorage.setItem('radioFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStationSelect = (station: Station) => {
    setCurrentStation(station);
  };

  const handleToggleFavorite = (station: Station) => {
    const isFavorite = favorites.some(fav => fav.stationuuid === station.stationuuid);
    
    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.stationuuid !== station.stationuuid));
    } else {
      // Add to favorites
      setFavorites([...favorites, station]);
    }
  };

  // fetch stations when search query changes
  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://de1.api.radio-browser.info/json/stations/search?limit=10${
            searchQuery ? `&name=${encodeURIComponent(searchQuery)}` : ""
          }`
        );
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // add debounce to search
    const timeoutId = setTimeout(() => {
      fetchStations();
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // this is just to set the first station as the current station
  useEffect(() => {
    if (stations.length > 0 && !currentStation) {
      setCurrentStation(stations[0]);
    }
  }, [stations, currentStation]);

  return (
    <>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        favorites={favorites}
        onSelectStation={handleStationSelect}
      />
      
      {/* ts is to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div 
        //for some reason, couldnt make the bg-opacity work?? holy jesus this isannoying
          className="fixed inset-0 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <main className="flex justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="w-full md:w-4/5 lg:w-3/4 xl:w-[1100px] p-6 my-8 rounded-xl bg-gray-800 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* Sidebar Toggle */}
            <div 
              className="cursor-pointer p-2 hover:bg-gray-700 rounded-lg transition-colors"
              onClick={toggleSidebar}
            >
              <FaBars className="text-purple-400 text-2xl hover:text-purple-300" />
            </div>
  
            {/* Title */}
            <div className="flex items-center">
              <FaHeadphones className="text-purple-500 text-4xl mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Radio Browser
              </h1>
            </div>
            
            {/* Empty div (js for alignment) */}
            <div className="w-8"></div>
          </div>
              
          <div className="space-y-6">
            {/* Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-700/50 p-4 rounded-lg">
                <div className="flex items-center">
                    <FaMusic className="text-pink-400 mr-2" />
                    <button 
                    className="text-xl font-bold bg-transparent border-0 p-0 text-white focus:outline-none hover:text-purple-300 transition-colors" 
                    type="button"
                    onClick={toggleSidebar}
                    >
                    FAVORITE RADIOS
                    </button>
                </div>
                {/* Search Input */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search for Stations" 
                      className="w-64 py-2 pl-10 pr-4 rounded-full bg-gray-900 border-2 border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Radios */}
            <div className="bg-gray-700/30 rounded-xl p-4 shadow-inner">
              {/* Current Radio */}
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg backdrop-blur-sm">
                {currentStation ? (
                  <CurrentPlaying station={currentStation} />
                ) : (
                  <div className="text-center py-4">Select a station to play</div>
                )}
              </div>
              
              {/* Radio List */}
              <div className="max-h-[400px] overflow-y-auto pr-2 mt-4 custom-scrollbar space-y-2">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : stations.length === 0 ? (
                  <div className="text-center py-4">No stations found</div>
                ) : (
                  stations.map(station => (
                    <RadioSelect
                      key={station.stationuuid}
                      station={station}
                      isActive={currentStation?.stationuuid === station.stationuuid}
                      isFavorite={favorites.some(fav => fav.stationuuid === station.stationuuid)}
                      onSelect={() => handleStationSelect(station)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RadioPlayer;