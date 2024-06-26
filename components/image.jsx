import Image from "next/image";

const Portrait = () => {
  return (
    <div className="mt-5 sm:mt-0 sm:ml-5">
      <div className="text-center">
        <Image
          className="border-[2px] border-gray text-gray mr-0 sm:mr-[135px]"
          src={"/pictures/ethan-lobo.png"}
          alt="Ethan Lobo KTP President"
          width={720}
          height={428}
          layout="fixed"
        />
        <p className="font-georgia text-white text-paragraph text-center pt-2">
          Ethan Lobo
        </p>
        <p className="font-georgia text-white text-paragraph text-center pt-0.5">
          President
        </p>
      </div>
    </div>
  );
};

export default Portrait;
