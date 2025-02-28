import RadioSelect from "../components/RadioSelect"
import { FaSearch } from "react-icons/fa";
import CurrentPlaying from "../components/CurrentPlaying";

const RadioPlayer = () => {
  return (
  <>
    <main className="flex justify-center h-screen overflow-hidden">
    <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-[900px] 2xl:w-1/2 p-4 bg-gray-400 rounded-lg shadow-md">
            {/* Header */}
            <div className="flex items-center justify-center">
                <h1 className="text-3xl">Radio Browser</h1>
            </div>
            <div className="">
                {/* Search */}
                <div className="flex flex-row justify-between">
                    <h2>FAVORITE RADIOS</h2>
                    {/* Search Input */}
                    <div className="flex flex-row items-center justify-center">
                        <FaSearch className="mr-2"/>
                        <input type="text" placeholder="Search for Stations" className="w-36"/>
                    </div>
                </div>
                {/* Radios */}
                <div>
                    {/* Current Radio */}
                    <div>
                        <CurrentPlaying />
                    </div>
                    {/* Radio List */}
                    <div className="max-h-[400px] overflow-y-auto pr-2 mt-2 custom-scrollbar">
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