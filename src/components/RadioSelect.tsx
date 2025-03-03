import { FaPencilAlt, FaTrashAlt, FaPlayCircle, FaPauseCircle, FaHeart, FaRegHeart } from "react-icons/fa";

interface Station {
  stationuuid: string;
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
  language: string;
}

interface RadioSelectProps {
  station: Station;
  isActive?: boolean;
  isFavorite?: boolean;
  onSelect: () => void;
  onToggleFavorite?: (station: Station) => void;
}

const RadioSelect = ({ 
  station, 
  isActive = false, 
  isFavorite = false,
  onSelect,
  onToggleFavorite
}: RadioSelectProps) => {
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the parent
    if (onToggleFavorite) {
      onToggleFavorite(station);
    }
  };
  
  return (
    <article 
      onClick={onSelect}
      className={`flex flex-row w-full p-4 my-2 rounded-lg shadow-md cursor-pointer transition-all ${
        isActive 
          ? "bg-gradient-to-r from-purple-900/80 to-pink-900/80 text-white" 
          : "bg-gray-800/70 hover:bg-gray-700/80 text-white"
      }`}
    > 
      {/* Radio buttons */}
      <div className="flex flex-row justify-center items-center mr-4">
        {isActive ? (
          <FaPauseCircle size={25} className="text-purple-400" />
        ) : (
          <FaPlayCircle size={25} className="text-pink-400" />
        )}
      </div>
      <div className="flex flex-row w-full justify-between items-center">
        {/* Radio Info */}
        <div className="flex flex-col">
          <p className="font-medium text-lg">{station.name || "Unknown Station"}</p>
          <p className="text-sm text-gray-300">{station.country || "Unknown Location"}</p>
        </div>
        {/* Radio Actions */}
        <div className="flex flex-row justify-center items-center gap-3">
          {/* Favorite Button */}
          <div 
            className="p-2 hover:bg-gray-600/50 rounded-full transition-colors"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <FaHeart size={16} className="text-purple-500 hover:text-purple-400" />
            ) : (
              <FaRegHeart size={16} className="text-gray-300 hover:text-white" />
            )}
          </div>
          {/* Edit Button */}
          <div className="p-2 hover:bg-gray-600/50 rounded-full transition-colors">
            <FaPencilAlt size={16} className="text-gray-300 hover:text-white" />
          </div>
          {/* Delete Button */}
          <div className="p-2 hover:bg-gray-600/50 rounded-full transition-colors">
            <FaTrashAlt size={16} className="text-gray-300 hover:text-white" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default RadioSelect;