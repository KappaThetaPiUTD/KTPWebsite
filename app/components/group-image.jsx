import Image from 'next/image';
import MyImage from '../../public/pictures/exec-group.jpeg';

const Group = () => {
    return (
        <div>
            <style>
                {`
                `}
            </style>
            <div className="text-center">
                <div className='relative w-screen h-[515px]'>
                    <Image className='w-full h-auto opacity-50 text-gray object-cover' src={MyImage} alt="Executive Board" fill />
                </div>
            </div>
        </div>            
    )
}

export default Group;