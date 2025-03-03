import RadioSelect from "../components/RadioSelect"
import { FaSearch, FaMusic, FaHeadphones } from "react-icons/fa";
import CurrentPlaying from "../components/CurrentPlaying";

const RadioPlayer = () => {
  return (
  <>
    <main className="flex justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-[900px] p-6 my-8 rounded-xl bg-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <FaHeadphones className="text-purple-500 text-4xl mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Radio Browser
          </h1>
        </div>
        
        <div className="space-y-6">
          {/* Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-700/50 p-4 rounded-lg">
            <h2 className="text-xl font-bold flex items-center">
              <FaMusic className="text-pink-400 mr-2" />
              <span>FAVORITE RADIOS</span>
            </h2>
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for Stations" 
                className="w-64 py-2 pl-10 pr-4 rounded-full bg-gray-900 border-2 border-gray-700 focus:border-purple-500 focus:outline-none transition-all" 
              />
            </div>
          </div>
          
          {/* Radios */}
          <div className="bg-gray-700/30 rounded-xl p-4 shadow-inner">
            {/* Current Radio */}
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg backdrop-blur-sm">
              <CurrentPlaying />
            </div>
            
            {/* Radio List */}
            <div className="max-h-[400px] overflow-y-auto pr-2 mt-4 custom-scrollbar space-y-2">
              <RadioSelect />
              <RadioSelect />
              <RadioSelect />
              <RadioSelect />
              <RadioSelect />
              <RadioSelect />
              <RadioSelect />
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
  )
}

export default RadioPlayer