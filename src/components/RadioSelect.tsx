import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";

const RadioSelect = () => {
  return (
    <>
    <article className="flex flex-row w-full pl-5 xl:pl-8 2xl:pl-8 p-4 my-1 bg-white rounded-lg shadow-md"> 
        {/* Radio buttons */}
        <div className="flex flex-row justify-center items-center mr-10">
            <FaPlayCircle size={25}/>
        </div>
        <div className="flex flex-row w-full justify-between">
            {/* Radio Info */}
            <div className="flex flex-col">
                <span>exemplonome</span>
                <span>exemplodelugar</span>
            </div>
            {/* Radio Edit */}
            <div className="flex flex-row justify-center items-center gap-2">
                {/* Edit Button */}
                <div>
                    <FaPencilAlt size={25}/>
                </div>
                {/* Delete Button */}
                <div>
                    <FaTrashAlt size={25}/>
                </div>
            </div>
        </div>
    </article>
    </>
  )
}

export default RadioSelect