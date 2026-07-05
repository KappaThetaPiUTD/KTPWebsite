import Image from "next/image";

const Portrait = () => {
  return (
    <div className="mt-5 sm:mt-0 sm:ml-5">
      <div className="text-center">
        <Image
          className="border-[2px] border-white rounded-lg object-cover w-full max-w-[300px] sm:max-w-[340px] h-auto mx-auto"
          src={
            "https://res.cloudinary.com/dha44tosd/image/upload/c_thumb,g_face,ar_5:6,z_0.75/v1771190975/Brother%20Page/Actives/IMG_5423_fxoxkr.jpg"
          }
          alt="Kavinram Senthil KTP President"
          width={400}
          height={480}
          sizes="(max-width: 640px) 80vw, 340px"
        />
        <p className="font-georgia text-white text-paragraph text-center pt-2">
          Kavinram Senthil
        </p>
        <p className="font-georgia text-white text-paragraph text-center pt-0.5">
          President
        </p>
      </div>
    </div>
  );
};

export default Portrait;
