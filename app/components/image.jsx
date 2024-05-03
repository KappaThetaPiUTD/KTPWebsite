import Image from 'next/image';
import MyImage from '../../public/pictures/ethan-lobo.png';

const Portrait = () => {
    return (
        <div>
            <div className="text-center">
                <Image className='border-[2px] border-gray w-[1300px] h-[428px] text-gray mr-[135px]' src={MyImage} alt="Ethan Lobo KTP President" width={364} height={428}/>
                <p className='font-georgia text-gray text-paragraph text-center pt-2'>Ethan Lobo</p>
                <p className='font-georgia text-gray text-paragraph text-center pt-0.5'>President</p>
            </div>
        </div>
    );
};

export default Portrait;