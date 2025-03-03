import { useState, useEffect } from "react";
import RadioSelect from "../components/RadioSelect";
import { FaSearch, FaMusic, FaHeadphones, FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CurrentPlaying from "../components/CurrentPlaying";
import Sidebar from "../components/Sidebar";

// interfaces just to make sure and avoid errors
interface Station {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  language: string;
}

// get initial favorites from localStorage
const getSavedFavorites = () => {
  try {
    const saved = localStorage.getItem('radioFavorites');
    console.log("Initial localStorage check:", saved);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Error loading initial favorites:", e);
    return [];
  }
};
const getSavedCurrentStation = () => {
    try {
      const saved = localStorage.getItem('radioCurrentStation');
      console.log("Initial current station check:", saved);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error loading saved current station:", e);
      return null;
    }
  };

// function to get a random API server (? maybe not the best way to do this i dont really know)
async function getApiUrl() {
  try {
    const response = await fetch('https://all.api.radio-browser.info/json/servers');
    const servers = await response.json();
    if (servers.length > 0) {
      const randomServer = servers[Math.floor(Math.random() * servers.length)];
      return `https://${randomServer.name}/json`;
    }
    return 'https://de1.api.radio-browser.info/json';
  } catch (error) {
    console.error('Error fetching API servers:', error);
    return 'https://de1.api.radio-browser.info/json';
  }
}

const RadioPlayer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStation, setCurrentStation] = useState<Station | null>(getSavedCurrentStation());
  const [favorites, setFavorites] = useState<Station[]>(getSavedFavorites());
  const [apiBaseUrl, setApiBaseUrl] = useState('https://de1.api.radio-browser.info/json');
  
  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStations, setTotalStations] = useState(0);
  const stationsPerPage = 10;
  const totalPages = Math.ceil(totalStations / stationsPerPage);

  // get API server on component mount
  useEffect(() => {
    getApiUrl().then(url => {
      console.log("Using API base URL:", url);
      setApiBaseUrl(url);
    });
  }, []);
  
  // saving favorites when they change
  useEffect(() => {
    console.log("Saving favorites to storage:", favorites);
    localStorage.setItem('radioFavorites', JSON.stringify(favorites));
    console.log("After saving, localStorage contains:", localStorage.getItem('radioFavorites'));
  }, [favorites]);
  
  useEffect(() => {
    if (currentStation) {
      console.log("Saving current station to storage:", currentStation.name);
      localStorage.setItem('radioCurrentStation', JSON.stringify(currentStation));
    }
  }, [currentStation]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStationSelect = (station: Station) => {
    setCurrentStation(station);
  };

  const handleToggleFavorite = (station: Station) => {
    const isFavorite = favorites.some(fav => fav.stationuuid === station.stationuuid);
    
    // remove from favorites if already favorited, otherwise add
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.stationuuid !== station.stationuuid));
    } else {
      setFavorites([...favorites, station]);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // fetch stations when search query or page changes
  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * stationsPerPage;
        
        // using the API base URL with pagination
        const response = await fetch(
          `${apiBaseUrl}/stations/search?limit=${stationsPerPage}&offset=${offset}${
            searchQuery ? `&name=${encodeURIComponent(searchQuery)}` : ""
          }`,
          {
            headers: {
              'User-Agent': 'RadioBrowserWebApp/1.0',
            }
          }
        );

        const totalHeader = response.headers.get('X-Total-Count');
        if (totalHeader) {
          setTotalStations(parseInt(totalHeader, 10));
        }
        
        const data = await response.json();

        if (data.length > 0 && !totalHeader) {
          if (data.length < stationsPerPage) {
            setTotalStations(data.length); 
          } else {
            setTotalStations(data.length * 100);
          }
        }
        try {
          console.log("Trying CORS proxy...");
          const offset = (currentPage - 1) * stationsPerPage;
          const response = await fetch(
            `https://api.allorigins.win/get?url=${encodeURIComponent(
              `https://de1.api.radio-browser.info/json/stations/search?limit=${stationsPerPage}&offset=${offset}${
                searchQuery ? `&name=${encodeURIComponent(searchQuery)}` : ""
              }`
            )}`
          );
          const data = await response.json();
          const stations = JSON.parse(data.contents);
          setStations(stations);
        } catch (proxyError) {
          console.error("Proxy attempt also failed:", proxyError);
        }
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(() => {
      fetchStations();
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery, apiBaseUrl, currentPage]);

  // set first station as current station 
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
        onRemoveFavorite={handleToggleFavorite}
      />
      
      {/* this is to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div 
        //sidebar bg opacity wont work? dont really know why but probabbly this is ok for now
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
            
            {/* Empty div (alignment only) */}
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
                  <>
                    {stations.map(station => (
                      <RadioSelect
                        key={station.stationuuid}
                        station={station}
                        isActive={currentStation?.stationuuid === station.stationuuid}
                        isFavorite={favorites.some(fav => fav.stationuuid === station.stationuuid)}
                        onSelect={() => handleStationSelect(station)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </>
                )}
              </div>
                {/* Pagination Controls */}
                {!loading && stations.length > 0 && totalStations > stationsPerPage && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-600">
                  <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      currentPage === 1 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <FaChevronLeft className="mr-1" /> 
                    Previous
                  </button>
                  
                  <div className="text-gray-300">
                    Page {currentPage} of {totalPages || '?'}
                  </div>
                  
                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      totalPages && currentPage === totalPages 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    Next
                    <FaChevronRight className="ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default RadioPlayer;