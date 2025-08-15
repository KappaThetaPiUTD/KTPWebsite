import Image from "next/image";

const Portrait = () => {
  return (
    <div className="mt-5 sm:mt-0 sm:ml-5">
      <div className="text-center">
        <Image
          className="border-[2px] text-gray mr-0 sm:mr-[135px] aspect-square object-scale-down"
          src={"https://res.cloudinary.com/dha44tosd/image/upload/v1740683145/image_3_u0bo8p.png"}
          alt="Afsar Arif KTP President"
          width={720}
          height={428}
          layout="fixed"
        />
        <p className="font-georgia text-white text-paragraph text-center pt-2">
          Afsar Arif
        </p>
        <p className="font-georgia text-white text-paragraph text-center pt-0.5">
          President
        </p>
      </div>
    </div>
  );
};

export default Portrait;
