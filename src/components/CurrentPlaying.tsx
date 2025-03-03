import { FaPlayCircle } from 'react-icons/fa'

const CurrentPlaying = () => {
  return (
    <>
    <article>
        <div className="flex flex-row w-full pl-5 xl:pl-8 2xl:pl-8 p-4 my-1 bg-white rounded-lg shadow-md">
            <div className='flex flex-row justify-center items-center mr-10'>
                <FaPlayCircle size={25} color='black'/>
            </div>
            <h2 className='text-black'>Currently Playing</h2>
        </div>
    </article>
    </>
  )
}

export default CurrentPlaying