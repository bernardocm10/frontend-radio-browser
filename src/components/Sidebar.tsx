import { FaTimes, FaCog } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
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
        <div>
            <input type="text" className='bg-gray-700 rounded-lg w-full py-2 px-4 text-black' placeholder='Search Here'/>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-3">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </nav>
        
        <div className="pt-4 border-t border-gray-700">
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